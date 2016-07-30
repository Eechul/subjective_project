var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var pbkfd2Password = require("pbkdf2-password");
var smtpTransport = require('./module/email/smtpMethod')();
var Promise = require('promise');
//var fs = require('fs');
var app = express();
var hasher = pbkfd2Password();
var dateFormat = require('./config/userFunction/dateFormat')

var mysql = require('mysql');
var conn = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'dongdb',
   database : 'webquizdb'
});
conn.connect();

app.use(session({
  secret: '123215415@@DSAGnklndklsa',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host      : 'localhost',
    port      : 3306,
    user      : 'root',
    password  : 'dongdb',
    database  : 'webquizdb'
  })
}));
app.use(express.static('public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false}))

app.get('/login', function(req, res) {
  res.render('login', {register: false})
})
// 이메일 인증 과정
app.get('/register/:id', function(req, res) {
  var stnum = req.params.id
  console.log('success!');
  var sql = 'UPDATE STUDENT SET confirm = 1 WHERE stnum = ?'
  conn.query(sql, [stnum], function(err, data) {
    if(err) {
      console.log(err);
    } else {
      res.render('login', {register: true})
    }
  })
})

app.get('/register', function(req, res) {
  var sql = 'SELECT DETNUM, DETNAME FROM DEPARTMENT'
  conn.query(sql, [], function(err, results, fields) {
    if(err) {
      console.log(err);
    } else {
        console.log(results);
        res.render('register', {detresults : results})
    }
  })
})



app.post('/register', function(req, res) {
  var register = [
   req.body.detnum,
   req.body.email,
   req.body.name,
   req.body.gender,
   req.body.birthdate
 ]
 var pswdsecurity = {
   email : register[1]
 }
  // 1. 학생테이블에 정보 저장
  var promise1 = new Promise(function (resolve, reject) {
    var sql ="INSERT INTO student(detnum, stemail, stname, stgender, stbirthdate) VALUES (?, ?, ?, ?, ?)"
    conn.query(sql, register, function(err, data) {
     if(err) {
       console.log(err);
       reject(err)
     } else {
       console.log("log: 1");
       console.log(pswdsecurity);
       resolve("good1");
     }
    });
  })

  var promise2 = new Promise(function (resolve, reject) {
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
          console.log(pswdsecurity);
          // 회원가입 승인 메일 전송 부분
          var mailOptions={
                  from : "webQuiz관리자 <choise154@gmail.com>",
                  to : register[1], // 이메일 아이디
                  subject : "[webQuiz] 이메일 인증 서비스 입니다.",
                  // text : "Your Text",
                  html : `<h2>
                    <a href="http://localhost:3005/register/${pswdsecurity.stnum}">
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
          res.redirect('/login');
        }
      })
    });
  })
});


app.listen(3005, function(){
  console.log('Connected 3005 port!!!');
})
