module.exports = function() {
  var express = require('express');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var app = express();

  app.use(express.static('public'));
  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
  app.use(bodyParser.urlencoded({ extended: false}))

  return app;
}
