module.exports = function() {
  var pbkfd2Password = require("pbkdf2-password");
  var hasher = pbkfd2Password();
  var smtpTransport = require('../module/email/smtpMethod')();
  var Promise = require('promise');
  var route = require('express').Router();
  var conn = require('../config/db/mysql')();
  var makeConfirm = require('../config/userFunction/makeConfirm')

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

  return route;
}
