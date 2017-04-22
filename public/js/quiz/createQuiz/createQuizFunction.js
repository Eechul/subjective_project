function removeQuestion() {
  if(!this.parentNode) {
    return 0;
  }
  var questionNumber = this.parentNode.id.split('_')[1];
  var questionIndex = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber)) // 인덱스 추출
  MYAPP.sequenceArr.splice(questionIndex,1) // 배열 삭제
  this.parentNode.remove() // 노드(html) 삭제
  for(var i=questionIndex; i<MYAPP.sequenceArr.length; i++) {
    $("#questionNumber_"+MYAPP.sequenceArr[i].number).text(i+1+'번')
  }
}
