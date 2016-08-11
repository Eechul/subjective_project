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
            <label id="number_${number}">1</label>
            <input id="exampleAnswer_${number}" name="checkAnswer" type="checkbox" />
            <input id="exampleText_${number}" type="text">
            <button type="button" id="removeExample" class="btn btn-lg btn-danger btn-xs">삭제</button>
    </div>
    `
    sequenceArr.push(number)
    var index = sequenceArr.indexOf(Number(number))+1
    console.log(index);
    $("#examples").append(example);
    $("#number_"+number).text(index)
    console.log(sequenceArr);
    number++;

  });
  $("body").on("click", "#removeExample", function() {
    //console.log(sequenceArr.slice(i,1));
    var exampleId = this.parentNode.id
    console.log($("#"+exampleId).children()[0].id );

    var splitStr = exampleId.split('_')
    // console.log(this.parentNode.children[0].text());
    var exampleIndex= sequenceArr.indexOf(Number(splitStr[1]))
    console.log(exampleIndex);
    sequenceArr.splice(exampleIndex,1);
    for(var i=exampleIndex+1; i<number; i++) {
      $("#number_"+i).text(i-1)
    }
    this.parentNode.remove();

  });

})
