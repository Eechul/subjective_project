var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var pbkfd2Password = require("pbkdf2-password");
//var fs = require('fs');
var app = express();
var hasher = pbkfd2Password();
var dateFormat = require('./config/userFunction/dateFormat')

var mysql = require('mysql');
var conn = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'onlyroot',
   database : 'mysql'
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
    password  : 'onlyroot',
    database  : 'mysql'
  })
}));
app.use(express.static('public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false}))

app.get('/login', function(req, res) {
  res.render('login')
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
  var pswdsecurity = {}
  var register = [
   req.body.detnum,
   req.body.email,
   req.body.name,
   req.body.gender,
   req.body.birthdate
 ]
  // 1. 학생테이블에 정보 저장
 var sql ="INSERT INTO student(detnum, stemail, stname, stgender, stbirthdate) VALUES (?, ?, ?, ?, ?)"
  conn.query(sql, register, function(err, data) {
   if(err) {
     console.log(err);
   } else {
     console.log("log: 1");
     pswdsecurity.stnum = data.insertId;
     console.log(pswdsecurity);

     // 지금은 학생만이지만 나중에는 교수와 같이 할 것이기 때문에 수정요망
   }
 });

  //2. 비밀번호 보안테이블에 삽입
  return hasher({password:req.body.password_confirm}, function(err, pass, salt, hash) {
      console.log("log: 2");
      pswdsecurity.pwdhash = hash
      pswdsecurity.pwdsalt = salt

      // 마찬가지로 지금은 학생만이지만 나중에는 교수와 같이 할 것이기 때문에 수정요망
      var sql="INSERT INTO password_security(stnum, pwdhash, pwdsalt) SET ?"
      conn.query(sql, pswdsecurity, function(err, results) {
        console.log("log: 3");
        if(err) {
          console.log(err);
          res.status(500);
        } else {
          console.log(pswdsecurity);
          res.redirect('/login');
        }
      })
  });


})


app.listen(3005, function(){
  console.log('Connected 3005 port!!!');
})
