var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var fs = require('fs');
var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'dongdb',
   database : 'webquizdb'
});
conn.connect();

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false}))

app.get('/login', function(req, res) {
  res.render('login')
})

app.get('/register', function(req, res) {
  res.render('register')
})

app.post('/register', function(req, res) {
  var register = {
    name : req.body.name,
    gender : req.body.gender,
    email: req.body.email,
    password_input : req.body.password_input,
    password_confirm : req.body.password_confirm,
    birthdate : req.body.birthdate
  }
  var sql ="INSERT INTO student SET ?"
  conn.query(sql, register, function(err, results) {

  });


})


app.listen(3005, function(){
  console.log('Connected 3005 port!!!');
})
