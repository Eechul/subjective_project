module.exports = function(app) {
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var passport = require('passport')
  var hasher = require('../encipherment/hasher')()
  var LocalStrategy = require('passport-local').Strategy;
  var conn = require('../db/mysql')();

  app.use(session({
    secret: '123215415@@DSAGnklndklsa',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host      : 'localhost',
      port      : 3306,
      user      : 'root',
      password  : 'onlyroot',
      database  : 'webquizdb'
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

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
          if(user && uname === user.email){
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

  return passport;
}
