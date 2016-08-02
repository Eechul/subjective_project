var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
var dateFormat = require('./config/userFunction/dateFormat')
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
var home = require('./routes/home')();
app.use('/home', home);

app.get('/home', function(req, res) {
  res.render('login', {register: false})
})

app.listen(3005, function(){
  console.log('Connected 3005 port!!!');
})
