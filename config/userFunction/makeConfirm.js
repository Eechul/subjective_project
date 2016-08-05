String.prototype.makeConfirmId = function() {
  var confirmId = "";
  for( var i=0; i < 6; i++ )
    confirmId += this.charAt(Math.floor(Math.random() * this.length));

  return confirmId;
}
