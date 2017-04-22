module.exports = function() {
  var mysql = require('mysql');
  var conn = mysql.createConnection({
     host     : 'localhost',
     user     : 'root',
     password : 'onlyroot',
     database : 'webquizdb'
  });
  conn.connect();


  return conn;
}
