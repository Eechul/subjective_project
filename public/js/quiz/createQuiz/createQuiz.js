var exampleNumber = 1;
var questionNumber = 2;
var buttonNumber = 1;
var sequenceArr = [];
$(document).ready(function(){
  $("#addQuestion").click(function(){
    var question = `<div id="question_${questionNumber}">
      <label>${questionNumber}번</label>
      <div class="container-fluid text-center">
        <label class="radio-inline">
            <input type="radio" id="question_type" name="question_type_${questionNumber}"
                value="multiple_choice_${questionNumber}">객관식
        </label>
        <label class="radio-inline">
            <input type="radio" id="question_type" name="question_type_${questionNumber}"
                value="short_answer_${questionNumber}">주관식
        </label>
      </div>
      <div id="question_type_load_${questionNumber}"></div>
    </div>
    `
    $(".questions").append(question)
    questionNumber++;
  });

  $("#saveQuestion").click(function() {
    // 문제점: number가 커지면 포문이 많이돌게됨..
  //   for(var i=1; i<number; i++) {
  //     if($("#exampleText_"+i)){
  //       console.log(i+') '+$("#exampleText_"+i).val());
  //     }
  //   }
  })
  $("body").on("change", "input[id=question_type]", function() {
    var questionNumber = $(this).val().split('_')[2]
    console.log(questionNumber);
    if($(this).val() == 'multiple_choice_'+questionNumber) {
      $('#question_type_load_'+questionNumber).load('/ajax/loadCreateQuiz.ejs #multiple_choice')
    }
    else if($(this).val() == 'short_answer_'+questionNumber) {
      $('#question_type_load_'+questionNumber).load('/ajax/loadCreateQuiz.ejs #short_answer')
    }
  })
  // $("input[name=question_type]").change(function() {
  //   if($(this).val() == 'multiple_choice') {
  //     $('#question_type_load').load('/ajax/loadCreateQuiz.html #multiple_choice')
  //   }
  //   else if($(this).val() == 'short_answer') {
  //     $('#question_type_load').load('/ajax/loadCreateQuiz.html #short_answer')
  //   }
  // })
  //
  $("body").on("click", "#addExample", function() {
    var example =
    `<div id="example_${exampleNumber}">
            <label id="number_${exampleNumber}"></label>
            <input id="exampleAnswer_${exampleNumber}" name="checkAnswer" type="checkbox" />
            <input id="exampleText_${exampleNumber}" name="exampleContent" type="text">
            <button type="button" id="removeExample" class="btn btn-lg btn-danger btn-xs">삭제</button>
    </div>
    `
    sequenceArr.push(exampleNumber)
    var index = sequenceArr.indexOf(Number(exampleNumber))+1
    console.log(index);
    $("#examples").append(example);
    $("#number_"+exampleNumber).text(index)
    console.log(sequenceArr);
    exampleNumber++;

  });
  $("body").on("click", "#removeExample", function() {
    //1. '삭제'버튼의 부모노드는 찾는다.
    //2. 부모노드의 id값을 split을 이용해 추출
    //3. 그 아이디값을 sequenceArr 배열에서 index를 찾는데 사용
    //4. sequenceArr 배열에서 아이디값을 삭제
    //5. 부모노드를 삭제
    //6. 삭제고 난 후의 sequenceArr 배열에 맞게 순서 정렬
    //=> index: 보기의 번호, 값: 태그의 아이디값
    var exampleId = this.parentNode.id
    var splitStr = exampleId.split('_')[1]
    var exampleIndex= sequenceArr.indexOf(Number(splitStr))
    console.log(exampleIndex);
    sequenceArr.splice(exampleIndex,1);
    console.log(sequenceArr);
      this.parentNode.remove();
    for(var i=exampleIndex; i<sequenceArr.length; i++) {
      $("#number_"+sequenceArr[i]).text(i+1)
    }
  });
  $("body").on("focus", "input[name=exampleContent]", function() {
    $(this).attr('size','50')
  });
  $("body").on("blur", "input[name=exampleContent]", function() {
    $(this).removeAttr('size')
  });
 //  $("input[name=exampleContent]").focus(function(){
 //    alert('gogo')
 // })


})
