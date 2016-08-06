module.exports = function(passport) {
  var pbkfd2Password = require("pbkdf2-password");
  var hasher = pbkfd2Password();
  var smtpTransport = require('../module/email/smtpMethod')();
  var Promise = require('promise');
  var route = require('express').Router();
  var conn = require('../config/db/mysql')();
  var makeConfirm = require('../config/userFunction/makeConfirm')
  var randomStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  // 전역변수 안두는 방법 고안해보기 **

  route.post(
    '/login',
    passport.authenticate(
      'local',
      { successRedirect: '/main',
        failureRedirect: '/home',
        failureFlash: false
      }
     )
   );
     // 이메일 인증 과정
  route.get('/register/:id', function(req, res) {
    var id = req.params.id
    var sql = 'UPDATE student SET confirm = 1 WHERE confirm = ?'
    conn.query(sql, [id], function(err, data) {
      if(err) {
        console.log(err);
      } else {
        res.redirect('/')
      }
    })
  })

  route.post('/checkEmail', function(req, res) {
    var email = req.body.email;
    console.log('email', email);
    var sql = 'SELECT stemail FROM student where stemail = ?'
    conn.query(sql, [email], function(err, data, fields) {
      if(err) {
        console.log(err);
      } else {
        console.log('data[0].stemail', data[0]);
        if(data[0]) {
          res.send({result:true})
        } else {
          res.send({result:false})
        }
      }
    })
  })
  route.get('/', function(req, res) {
    res.render('login')
  })

  route.get('/register', function(req, res) {
    var sql = 'SELECT DETNUM, DETNAME FROM DEPARTMENT'
    conn.query(sql, function(err, results, fields) {
      if(err) {
        console.log(err);
      } else {
          console.log(results);
          res.render('register', {detresults : results})
      }
    })
  })
  route.post('/register', function(req, res) {
    var confirm = randomStr.makeConfirmId(); // 이메일을 섞어서 인증번호를 만듬,,;; 이상한거같긴함
    console.log(confirm);
    var register = [
     req.body.detnum,
     req.body.email,
     req.body.name,
     req.body.gender,
     req.body.birthdate,
     confirm
   ]
   var pswdsecurity = {
     email : register[1]
   }
    // 1. 학생테이블에 정보 저장
    var studentInsertPromise = new Promise(function (resolve, reject) {
      var sql ="INSERT INTO student(detnum, stemail, stname, stgender, stbirthdate, confirm) VALUES (?, ?, ?, ?, ?, ?)"
      conn.query(sql, register, function(err, data) {
       if(err) {
         console.log(err);
         reject(err)
       } else {
         resolve("good1");
       }
      });
    })

    var pwdHashInsertPromise = new Promise(function (resolve, reject) {
      hasher({password:req.body.password_confirm}, function(err, pass, salt, hash) {
        console.log("log: 2");
        pswdsecurity.pwdhash = hash
        pswdsecurity.pwdsalt = salt

        // 마찬가지로 지금은 학생만이지만 나중에는 교수와 같이 할 것이기 때문에 수정요망
        // (수정 -> 교수번호, 학생번호 다 빼고 이메일 칼럼 하나를 넣음. )
        var sql="INSERT INTO password_security SET ?"
        conn.query(sql, pswdsecurity, function(err, results) {
          console.log("log: 3");
          if(err) {
            console.log(err);
            reject(err)
          } else {
            // 회원가입 승인 메일 전송 부분
            var mailOptions={
                    from : "webQuiz관리자 <choise154@gmail.com>",
                    to : register[1], // 이메일 아이디
                    subject : "[webQuiz] 이메일 인증 서비스 입니다.",
                    // text : "Your Text",
                    html : `<h2>
                      <a href="http://localhost:3005/home/register/${confirm}">
                        ${register[2]}님, 인증을 완료하세요!</a>
                      </h2>`
                }
                smtpTransport.sendMail(mailOptions, function(err, res){
                  if(err){
                      console.log(err);
                  }else{
                      console.log("Message sent success");
                  }
              });
              resolve('good2')
            res.redirect('/home');
          }
        })
      });
    })
  });
  return route;
}
