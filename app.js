var app = require('./config/express/expressjs')();
var dateFormat = require('./config/userFunction/dateFormat');
var conn = require('./config/db/mysql')();
var passport = require('./config/passportjs/passport')(app);

var home = require('./routes/home')(passport);
var main = require('./routes/main')();

app.use('/home', home);
app.use('/main', main);

app.listen(3005, function(){
  console.log('Connected 3005 port!!!');
});
