module.exports = function() {
  var pbkfd2Password = require("pbkdf2-password");
  var hasher = pbkfd2Password();
  var smtpTransport = require('../module/email/smtpMethod')();
  var Promise = require('promise');
  var route = require('express').Router();
  var conn = require('../config/db/mysql')();
  var makeConfirm = require('../config/userFunction/makeConfirm')
  var randomStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  // 전역변수로 안놓는 방법 고안하기

  route.get('/', function(req, res) {
    if(req.user.stemail){
      res.render('main')
    } else {
      console.log('세션없음');
    }
  })
  route.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/home')
  })
  route.get('/createquiz', function(req, res) {
      res.render('createQuiz')
    })
  route.get('/replayConfirm', function(req, res) {
    var user = req.user
    var confirm = randomStr.makeConfirmId();

    var studentUpdatePromise = new Promise(function (resolve, reject) {
      var sql ="UPDATE student SET confirm = ? WHERE stemail = ?"
      conn.query(sql, [confirm, user.stemail], function(err, data) {
       if(err) {
         console.log(err);
         reject(err)
       } else {
         resolve("good2");
       }
      });
    })

    var mailOptions= {
            from : "webQuiz관리자 <choise154@gmail.com>",
            to : user.stemail, // 이메일 아이디
            subject : "[webQuiz] 이메일 인증 서비스 입니다.",
            // text : "Your Text",
            html : `<h2>
              <a href="http://localhost:3005/home/register/${confirm}">
                ${user.stname}님, 인증을 완료하세요!</a>
              </h2>`
        }
        smtpTransport.sendMail(mailOptions, function(err, res){
          if(err){
              console.log(err);
          }
      });
    res.redirect('/home')
  })
  return route;
}
