var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var pbkfd2Password = require("pbkdf2-password");
var hasher = pbkfd2Password();
var app = express();
var dateFormat = require('./config/userFunction/dateFormat')
var conn = require('./config/db/mysql')();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: false}))

passport.serializeUser(function(user, done) {
  done(null, user.email); // 고유한 아이디값 있어야댐... 흠...
});
passport.deserializeUser(function(id, done) {
  var sql = "SELECT * FROM student where stemail = ?"
  conn.query(sql, [id],function(err, result, fields) {
    var user = result[0]
    if(user.stemail === id) {
      done(null, user);
    }
  })
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    // 세션 등록할 유저 --
    var uname = username;
    var pwd = password;
    // 1. 유저 아이디 같은걸 찾고
    var sql = "SELECT email, pwdsalt, pwdhash FROM password_security "
    sql += "WHERE  email=(SELECT stemail 'email' from student where stemail = ?)"
    console.log(sql);
    conn.query(sql, [uname], function(err, result, fields) {
      var user = result[0]
      if(err) {
        console.log(err);
      } else {
        if(uname === user.email){
          return hasher({password:pwd, salt:user.pwdsalt}, function(err,
          pass, salt, hash) {
            if(hash === user.pwdhash) {
              done(null, user)
            } else {
              done(null, false)
            }
          })
        } else {
          done(null, false)
        }
      }
    })
    // 2. db의 salt 를 이용해서 패스워드 hash를 만들어서 암호화 비교
    // 3-1.둘 다 맞다면 세션등록 후 main 페이지 이동
    // 3-2.둘중에 하나라도 아니면 페이지에 alert창 띄우기 (아이디나 비밀번호가 틀렸습니다)
  }
));
var home = require('./routes/home')(passport);
var main = require('./routes/main')();
app.use('/home', home);
app.use('/main', main);

app.listen(3005, function(){
  console.log('Connected 3005 port!!!');
})
