module.exports = function() {
  var pbkfd2Password = require("pbkdf2-password");
  var hasher = pbkfd2Password();

  return hasher;
}
