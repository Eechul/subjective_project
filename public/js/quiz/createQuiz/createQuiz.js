MYAPP = {};
MYAPP.allScore = 0;
MYAPP.questionNumber = 1;
MYAPP.exampleNumber = 1;
MYAPP.sequenceArr = [];
MYAPP.sequenceArr[0] = {
  number : 1,
  example : [0],
  answer : [],
  score : 0,
  option : {
    partScore : false
  }
};
// example 프로퍼티의 자료구조
// example[i] = {
//   number : 고유 exampleNumber
//   checked : 'true' and 'false'
// }

// TODO : 문제 출제시, 도움말 추가.
// TODO : 객관식 출제 먼저!
// 부분점수 알고리즘 생각해내기 현재는 통합 점수만 생각해놈.
// 객관-> 주관식 혹은 반대로 넘어갈때, 보기가 지워진다는 경고 메세지 출력
// 주석
// 레이아웃 통일 시키기 (기존 html과 자바스크립트 html)

// 교수가 객관식마다 부분점수 있나 없나도 정할수 있게
//객관식
// - 체크박스 클릭 -> 체크개수 증가와 '체크한 보기번호' : input text 박스' 동적출력

// 문제점수 /(나누기) 체크개수 로 문제당 부분 점수 출력
$(document).ready(function(){
  $("body").on("change", "input[name=checkAnswer]", checkedExample);

  // 문제 삭제
  $("body").on("click", "#removeQuestion", removeQuestion);
  //문제 추가
  $("#addQuestion").click(addQuestion);
  // 문제 저장
  $("#saveQuestion").click(saveQuestion);
  // 객관식이나 주관식으로 타입 바꿈 이벤트
  $("body").on("change", "input[id=question_type]", changeQuestionType);
  // 유사답안 추가
  $("body").on("click", "#addAnswer", addAnswer);
  // 유사답안 제거
  $("body").on("click", "#removeAnswer", removeAnswer);
  // 보기 추가
  $("body").on("click", "#addExample", addExample);
  // 보기 삭제
  $("body").on("click", "#removeExample", removeExample);
  // 유사답안이나 보기 클릭 시 text 박스 늘어남
  $("body").on("focus", "input[name=exampleContent]", function() {
    $(this).attr('size','50');
  });
  //// 유사답안이나 보기 클릭을 땔 시 text 박스 크기 원상복귀
  $("body").on("blur", "input[name=exampleContent]", function() {
    $(this).removeAttr('size');
  });
  $("body").on("click", "#partScore", checkePartScore);
});

var checkePartScore = function () {
  var questionNumber = this.parentNode.parentNode.id.split("_")[2];
  console.log(questionNumber);
  var questionIndex = getIndex(questionNumber);
  // var 
  // MYAPP.sequenceArr[questionIndex].example.map(function (e, i ){
  //
  // });
    MYAPP.sequenceArr[questionIndex].option.partScore =
      MYAPP.sequenceArr[questionIndex].option.partScore ? false : true ;

    if(MYAPP.sequenceArr[questionIndex].option.partScore) {
      var exampleId = MYAPP.sequenceArr[questionIndex].example
    }
  // 이게 체크되면 display : none 인 input text 드러내기
};

var writeScore = function (obj) {
  // 알고리즘
  // onchange 될때마다 순서배열 안에있는 번호를 통해
  // 합계를 통합적으로 구해준다.
  MYAPP.allScore += Number(obj.value);
  $("#allScore").text(MYAPP.allScore);
};
var getIndex = function(number) {
  return MYAPP.sequenceArr.map(function(e) {
    return e.number;
  }).indexOf(Number(number));
};
function checkedExample () {
    var checkedNumber =0;
    var questionNumber = this.parentNode.parentNode.id.split("_")[1];
    var questionIndex = getIndex(questionNumber);
    var exampleNumber = $(this).attr("id").split("_")[1];
    var exampleId  = this.parentNode.id.split('_')[1];
    var exampleIndex;
    MYAPP.sequenceArr[questionIndex].example.forEach( function(obj, index) {
      if(obj.number == exampleId) {
        obj.checked = obj.checked ? false : true;
        console.log(MYAPP.sequenceArr[questionIndex].example[index]);
        return ;
      }
    });

    // 체크 개수 세는 부분
    MYAPP.sequenceArr[questionIndex].example.forEach( function(obj, index) {
      if(obj.checked === true) {
        checkedNumber++;
      }
    });

    $("#questionAnswerNumber_"+questionNumber).text(checkedNumber);
}
function saveQuestion() {
  // 로그로 test
  // 'question_'+YAPP.sequenceArr[i].number 문제 안에서
  // 객관식 or 주관식 문제와 보기들을 읽어옴
  // for 1
  var quiz = MYAPP.sequenceArr.map(function(question, i) {
    return question;
  });
}


function removeQuestion() {
  var questionNumber = this.parentNode.id.split('_')[1];
  var questionIndex = getIndex(questionNumber); // 인덱스 추출
  MYAPP.sequenceArr.splice(questionIndex,1);// 배열 삭제
  this.parentNode.remove();// 노드(html) 삭제
  for(var i=questionIndex; i<MYAPP.sequenceArr.length; i++) {
    $("#questionNumber_"+MYAPP.sequenceArr[i].number).text(i+1+'번');
  }
}

function addQuestion() {
  var questionNumber = ++MYAPP.questionNumber; //전체 문제수 '증가시킨 후' 대입
  var question = {
    number : questionNumber,
    example : []
  };
  MYAPP.sequenceArr.push(question);
  var number = getIndex(questionNumber)+1; // 인덱스 추출
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
  `;

  $(".questions").append(question);
}

function changeQuestionType() {
  // TODO 객관식 -> 주관식, 주관식->객관식 타입 바뀌면 보기 문항 초기화 (경고표시 띄워주기)
  // TODO 맨 마지막에 수정
  var questionNumber = $(this).val().split('_')[2];
  var questionIndex = getIndex(questionNumber); // 인덱스 추출
  if($(this).val() == 'multiple_choice_'+questionNumber) {
    MYAPP.sequenceArr[questionIndex].example = [];
    $('#short_answer_'+questionNumber).remove();
    $('#question_type_load_'+questionNumber).append(`
      <div id="multiple_choice_${questionNumber}" class="container-fluid">
        <div class="">
            <label for="객관식">객관식</label>
            <textarea class="form-control" rows="5" id="comment" placeholder="문제입력"></textarea>
        </div>
        <div class="container-fluid">
          <div id="examples_${questionNumber}"></div>
          <button type="button" id="addExample" class="btn btn-lg btn-info btn-xs" >보기추가</button>
          <input type="checkbox" id="partScore"  name="part_score"/>부분점수여부
        </div>
      </div>
      `);
  }
  else if($(this).val() == 'short_answer_'+questionNumber) {
    MYAPP.sequenceArr[questionIndex].example = [];
    $('#multiple_choice_'+questionNumber).remove();
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
      `);
  }
}

function addAnswer() {
  var questionNumber = this.parentNode.parentNode.id.split('_')[2];
  var questionIndex = getIndex(questionNumber); // 인덱스 추출
  console.log(questionIndex);
  MYAPP.sequenceArr[questionIndex].example.push(MYAPP.exampleNumber);
  var number = MYAPP.sequenceArr[questionIndex].example.indexOf(Number(MYAPP.exampleNumber))+1;
  var answer =
    `<div id="answer_${MYAPP.exampleNumber}">
      <label id="answerNumber_${MYAPP.exampleNumber}">${number}.</label>
      <input id="answer_${MYAPP.exampleNumber}" name="exampleContent" type="text">
      <button type="button" id="removeAnswer" class="btn btn-lg btn-danger btn-xs">삭제</button>
    </div>`;
  $("#answers_"+questionNumber).append(answer);
  MYAPP.exampleNumber++;
}

function removeAnswer() {
  var questionNumber = this.parentNode.parentNode.id.split('_')[1];
  var questionIndex = getIndex(questionNumber);
  var answerId  = this.parentNode.id.split('_')[1];
  var answerIndex= MYAPP.sequenceArr[questionIndex].example.indexOf(Number(answerId));
  MYAPP.sequenceArr[questionIndex].example.splice(answerIndex,1);
  this.parentNode.remove();
  for(var i=answerIndex; i<MYAPP.sequenceArr[questionIndex].example.length; i++) {
    $("#answerNumber_"+MYAPP.sequenceArr[questionIndex].example[i]).text(i+1+".");
  }
}
function addExample() {
  var questionNumber = this.parentNode.parentNode.id.split('_')[2];
  var questionIndex = getIndex(questionNumber); // 인덱스 추출
  var exampleObj = {
    number : MYAPP.exampleNumber,
    checked : false
  };
  MYAPP.sequenceArr[questionIndex].example.push(exampleObj);
  var number = MYAPP.sequenceArr[questionIndex].example.indexOf(exampleObj)+1;
  var example =
    `<div id="example_${MYAPP.exampleNumber}">
            <label id="exampleNumber_${MYAPP.exampleNumber}">${number}.</label>
            <input id="exampleAnswer_${MYAPP.exampleNumber}" name="checkAnswer" type="checkbox" />
            <input id="exampleText_${MYAPP.exampleNumber}" name="exampleContent" type="text">
            <button type="button" id="removeExample" class="btn btn-lg btn-danger btn-xs">삭제</button>
    </div>`;
    if(MYAPP.sequenceArr[questionIndex].option.partScore) {
      example +=
      `<span class="examplePartScore_${MYAPP.exampleNumber} style="display : inline" >
        <label>ㄴ 부분점수:</label>
        <input type="text" id="examplePartScore_${MYAPP.exampleNumber}" name="" size="5"/>
      </span>`;
    }


  $("#examples_"+questionNumber).append(example);
  //$("#exampleNumber_"+MYAPP.exampleNumber).text(number)
  console.log(MYAPP.sequenceArr);
  MYAPP.exampleNumber++;
}

// TODO 수정중 08/22
function removeExample() {
  var questionNumber = this.parentNode.parentNode.id.split('_')[1];
  var questionIndex = getIndex(questionNumber);
  var exampleId  = this.parentNode.id.split('_')[1];
  var exampleIndex;
  MYAPP.sequenceArr[questionIndex].example.forEach( function(obj, index) {
    if(obj.number == exampleId) {
      exampleIndex = index;
      return ;
    }
  });
  MYAPP.sequenceArr[questionIndex].example.splice(exampleIndex,1);
  console.log(MYAPP.sequenceArr);
  this.parentNode.remove();
  for(var i=exampleIndex; i<MYAPP.sequenceArr[questionIndex].example.length; i++) {
    $("#exampleNumber_"+MYAPP.sequenceArr[questionIndex].example[i].number).text(i+1+".");
  }
}
