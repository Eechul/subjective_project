var number = 1;
var sequenceArr = [];
$(document).ready(function(){
  $("#saveQuestion").click(function() {
    // 문제점: number가 커지면 포문이 많이돌게됨..
    for(var i=1; i<number; i++) {
      if($("#exampleText_"+i)){
        console.log(i+') '+$("#exampleText_"+i).val());
      }
    }
  })
  $("input[name=question_type]").change(function() {
    if($(this).val() == 'multiple_choice') {
      $('#question_type_load').load('/ajax/loadCreateQuiz.html #multiple_choice')
    }
    else if($(this).val() == 'short_answer') {
      $('#question_type_load').load('/ajax/loadCreateQuiz.html #short_answer')
    }
  })
  //
  $("body").on("click", "#addExample", function() {
    var example =
    `<div id="example_${number}">
            <label id="number_${number}"></label>
            <input id="exampleAnswer_${number}" name="checkAnswer" type="checkbox" />
            <input id="exampleText_${number}" type="text">
            <button type="button" id="removeExample" class="btn btn-lg btn-danger btn-xs">삭제</button>
    </div>
    `
    console.log(typeof example);
    sequenceArr.push(number)
    console.log(sequenceArr);
    number++;
    $("#examples").append(example);

  });
  $("body").on("click", "#removeExample", function() {
    //console.log(sequenceArr.slice(i,1));
    var exampleId = this.parentNode.id
    console.log(exampleId);
    var splitStr = exampleId.split('_')
    console.log("splitStr", splitStr[1]);
    console.log("sequenceArr", sequenceArr.indexOf(Number(splitStr[1])));
    var exampleIndex= sequenceArr.indexOf(Number(splitStr[1]))
    sequenceArr.slice(exampleIndex,1);
    console.log(sequenceArr);
    this.parentNode.remove();

  });

})
