var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
//var fs = require('fs');
var app = express();
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
  var register = [
    req.body.detnum,
    req.body.email,
    req.body.name,
    // password_input : req.body.password_input,
    // password_confirm : req.body.password_confirm,
    req.body.gender,
    req.body.birthdate
  ]
  var sql ="INSERT INTO student(detnum, stemail, stname, stgender, stbirhdate) VALUES (?, ?, ?, ?, ?)"
  conn.query(sql, register, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });

})


app.listen(3005, function(){
  console.log('Connected 3005 port!!!');
})
