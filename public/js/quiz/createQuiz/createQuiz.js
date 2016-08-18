MYAPP = {}
MYAPP.questionNumber = 1;
MYAPP.exampleNumber = 1;
MYAPP.sequenceArr = []
MYAPP.sequenceArr[0] = {
  number : 1,
  example : []
}
//TODO : 문제 출제시, 도움말 추가.
//TODO : 코드중복 많음, 정리 요망
// 예) 1. map을 이용한 인덱스 추출, 2. function() < 묶어서 표현
// - 각종 중복 코드 하나로 묶어보기
// 현재 진행상황 -> 객관식, 주관식 자바스크립트를 이용해 동적인 문제 출제
// 할것 -1. 객관-> 주관식 혹은 반대로 넘어갈때, 보기가 지워진다는 경고 메세지 출력
// 2. 주석
// 3. 레이아웃 통일 시키기 (기존 html과 자바스크립트 html)
$(document).ready(function(){
  $("body").on("click", "#removeQuestion", function(e) {
    removeQuestion(this)
  });


  $("#addQuestion").click(function() {
    addQuestion()
  });

  $("#saveQuestion").click(function() {
    saveQuestion(this)
  })

  $("body").on("change", "input[id=question_type]", function() {
    changeQuestionType(this)
  })

  $("body").on("click", "#addAnswer", function() {
    addAnswer(this)
  });

  $("body").on("click", "#removeAnswer", function() {
    removeAnswer(this)
  });

  $("body").on("click", "#addExample", function() {
    addExample(this)
  });

  $("body").on("click", "#removeExample", function() {
    removeExample(this)
  });

  $("body").on("focus", "input[name=exampleContent]", function() {
    $(this).attr('size','50')
  });
  $("body").on("blur", "input[name=exampleContent]", function() {
    $(this).removeAttr('size')
  });
})

function saveQuestion(_this) {
  // 로그로 test
  // 'question_'+YAPP.sequenceArr[i].number 문제 안에서
  // 객관식 or 주관식 문제와 보기들을 읽어옴
  // for 1
  var quiz = MYAPP.sequenceArr.map( function(question, i) {
    return question
  })

  console.log(quiz);
}


function removeQuestion(_this) {
  var questionNumber = _this.parentNode.id.split('_')[1];
  var questionIndex = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber)) // 인덱스 추출
  MYAPP.sequenceArr.splice(questionIndex,1) // 배열 삭제
  _this.parentNode.remove() // 노드(html) 삭제
  for(var i=questionIndex; i<MYAPP.sequenceArr.length; i++) {
    $("#questionNumber_"+MYAPP.sequenceArr[i].number).text(i+1+'번')
  }
}

function addQuestion() {
  var questionNumber = ++MYAPP.questionNumber //전체 문제수 '증가시킨 후' 대입
  var question = {
    number : questionNumber,
    example : []
  }
  MYAPP.sequenceArr.push(question);
  var number = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber))+1 // 인덱스 추출
  var question = `<div id="question_${questionNumber}" class="question">
    <label id="questionNumber_${questionNumber}">${number}번</label>
    <button type="button" class="btn btn-lg btn-danger btn-xs" id="removeQuestion">문제삭제</button>
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
}

function changeQuestionType(_this) {
  // TODO 객관식 -> 주관식, 주관식->객관식 타입 바뀌면 보기 문항 초기화 (경고표시 띄워주기)
  // TODO 맨 마지막에 수정
  var questionNumber = $(_this).val().split('_')[2]
  var questionIndex = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber)) // 인덱스 추출
  if($(_this).val() == 'multiple_choice_'+questionNumber) {
    MYAPP.sequenceArr[questionIndex].example = []
    $('#short_answer_'+questionNumber).remove()
    $('#question_type_load_'+questionNumber).append(`
      <div id="multiple_choice_${questionNumber}" class="container-fluid">
        <div class="">
            <label for="객관식">객관식</label>
            <textarea class="form-control" rows="5" id="comment" placeholder="문제입력"></textarea>
        </div>
        <div class="container-fluid">
          <div id="examples_${questionNumber}"></div>
          <button type="button" id="addExample" class="btn btn-lg btn-info btn-xs" >보기추가</button>
        </div>
      </div>
      `);
  }
  else if($(_this).val() == 'short_answer_'+questionNumber) {
    MYAPP.sequenceArr[questionIndex].example = []
    $('#multiple_choice_'+questionNumber).remove()
    $('#question_type_load_'+questionNumber).append(`
      <div id="short_answer_${questionNumber}" class="container-fluid">
              <div class="form-group">
                  <label for="comment">주관식</label>
                  <textarea class="form-control" rows="5" id="comment" placeholder="문제입력"></textarea>
            </div>
            <div class="form-group">
                <label for="답안">답안</label>
                <div id="answers_${questionNumber}"></div>
            </div>
            <div class="container-fluid">
              <button type="button" id="addAnswer" class="btn btn-lg btn-info btn-xs" >유사답안추가</button>
            </div>
      </div>
      `)
  }
}

function addAnswer(_this) {
  var questionNumber = _this.parentNode.parentNode.id.split('_')[2];
  var questionIndex = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber)) // 인덱스 추출
  console.log(questionIndex);
  MYAPP.sequenceArr[questionIndex].example.push(MYAPP.exampleNumber)
  var number = MYAPP.sequenceArr[questionIndex].example.indexOf(Number(MYAPP.exampleNumber))+1
  var answer =
    `<div id="answer_${MYAPP.exampleNumber}">
      <label id="answerNumber_${MYAPP.exampleNumber}">${number}.</label>
      <input id="answer_${MYAPP.exampleNumber}" name="exampleContent" type="text">
      <button type="button" id="removeAnswer" class="btn btn-lg btn-danger btn-xs">삭제</button>
    </div>`
  $("#answers_"+questionNumber).append(answer);
  MYAPP.exampleNumber++;
}

function removeAnswer(_this) {
  var questionNumber = _this.parentNode.parentNode.id.split('_')[1]
  var questionIndex = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber))
  console.log(questionNumber);
  var answerId  = _this.parentNode.id.split('_')[1]
  var answerIndex= MYAPP.sequenceArr[questionIndex].example.indexOf(Number(answerId))
  console.log(answerId);
  MYAPP.sequenceArr[questionIndex].example.splice(answerIndex,1);
  console.log(MYAPP.sequenceArr);
  _this.parentNode.remove();
  for(var i=answerIndex; i<MYAPP.sequenceArr[questionIndex].example.length; i++) {
    $("#answerNumber_"+MYAPP.sequenceArr[questionIndex].example[i]).text(i+1+".")
  }
}

function addExample(_this) {
  var questionNumber = _this.parentNode.parentNode.id.split('_')[2];
  var questionIndex = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber)) // 인덱스 추출
  MYAPP.sequenceArr[questionIndex].example.push(MYAPP.exampleNumber)
  var number = MYAPP.sequenceArr[questionIndex].example.indexOf(Number(MYAPP.exampleNumber))+1
  var example =
    `<div id="example_${MYAPP.exampleNumber}">
            <label id="exampleNumber_${MYAPP.exampleNumber}">${number}.</label>
            <input id="exampleAnswer_${MYAPP.exampleNumber}" name="checkAnswer" type="checkbox" />
            <input id="exampleText_${MYAPP.exampleNumber}" name="exampleContent" type="text">
            <button type="button" id="removeExample" class="btn btn-lg btn-danger btn-xs">삭제</button>
    </div>`

  $("#examples_"+questionNumber).append(example);
  //$("#exampleNumber_"+MYAPP.exampleNumber).text(number)
  console.log(MYAPP.sequenceArr);
  MYAPP.exampleNumber++;
}

function removeExample(_this) {
  // (수정) 자료구조 = 1차원 배열 -> 2차원 배열 -> 1차원 배열+객체 var arr = [ { }, ... ]
  var questionNumber = _this.parentNode.parentNode.id.split('_')[1]
  var questionIndex = MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(questionNumber))

  var exampleId  = _this.parentNode.id.split('_')[1]
  var exampleIndex= MYAPP.sequenceArr[questionIndex].example.indexOf(Number(exampleId))
  console.log(exampleIndex);
  MYAPP.sequenceArr[questionIndex].example.splice(exampleIndex,1);
  console.log(MYAPP.sequenceArr);
  _this.parentNode.remove();
  for(var i=exampleIndex; i<MYAPP.sequenceArr[questionIndex].example.length; i++) {
    $("#exampleNumber_"+MYAPP.sequenceArr[questionIndex].example[i]).text(i+1+".")
  }
}
