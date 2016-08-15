MYAPP = {}
MYAPP.questionNumber = 2;
MYAPP.exampleNumber = 1;
MYAPP.sequenceArr = new Array(new Array());
MYAPP.sequenceArr[1] = new Array()

$(document).ready(function() {
  $("body").on("click", "#removeQuestion", function() {
  //$("#removeQuestion").click(function() {
    var questionNumber = this.parentNode.parentNode.id.split('_')[1];
    var questionNumberIndex= MYAPP.sequenceArr.indexOf(Number(questionNumber))
    MYAPP.sequenceArr.splice(questionNumberIndex,1);
    this.parentNode.parentNode.remove();
    console.log(MYAPP.sequenceArr);
    for(var i=questionNumberIndex; i<MYAPP.sequenceArr.length; i++) {
      $("#questionNumberText_"+MYAPP.sequenceArr[i]).text(i+1)
    }

    // var exampleIndex= MYAPP.sequenceArr[questionNumber].indexOf(Number(exampleId))
    // console.log(exampleIndex);
    // MYAPP.sequenceArr[questionNumber].splice(exampleIndex,1);
    // console.log(MYAPP.sequenceArr);
    // this.parentNode.remove();
    // for(var i=exampleIndex; i<MYAPP.sequenceArr[questionNumber].length; i++) {
    //   $("#number_"+MYAPP.sequenceArr[questionNumber][i]).text(i+1)
    // }

  })
  $("#addQuestion").click(function() {
    var questionNumber = MYAPP.questionNumber;
    MYAPP.sequenceArr[questionNumber] = new Array();
    var question = `<div id="question_${questionNumber}" class="question">
      <label id="questionNumberText_${questionNumber}">${questionNumber}번</label>
      <div class="container-fluid text-center">
        <button type="button" class="btn btn-lg btn-danger btn-xs" id="removeQuestion">문제삭제</button>
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
    MYAPP.questionNumber++
  });

  $("#saveQuestion").click(function() {

  })
  $("body").on("change", "input[id=question_type]", function() {
    var questionNumber = $(this).val().split('_')[2]
    if($(this).val() == 'multiple_choice_'+questionNumber) {
      MYAPP.sequenceArr[questionNumber] = new Array()
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
    else if($(this).val() == 'short_answer_'+questionNumber) {
      MYAPP.sequenceArr[questionNumber] = new Array()
      $('#multiple_choice_'+questionNumber).remove()
      $('#question_type_load_'+questionNumber).append(`
        <div id="short_answer_${questionNumber}" class="container-fluid">
                <div class="form-group">
                    <label for="comment">주관식</label>
                    <textarea class="form-control" rows="5" id="comment" placeholder="문제입력"></textarea>
              </div>
              <div class="form-group">
                  <label for="답안">답안</label>
                  <div id="answers"></div>
              </div>
              <div class="container-fluid">
                <button type="button" id="addAnswer" class="btn btn-lg btn-info btn-xs" >유사답안추가</button>
              </div>
        </div>
        `)
    }
  })
  $("body").on("click", "#addExample", function() {
    var questionNumber = this.parentNode.parentNode.id.split('_')[2];
    //console.log('test2',questionNumber);
    var example =
      `<div id="example_${MYAPP.exampleNumber}">
              <label id="exampleNumberText_${MYAPP.exampleNumber}"></label>
              <input id="exampleAnswer_${MYAPP.exampleNumber}" name="checkAnswer" type="checkbox" />
              <input id="exampleText_${MYAPP.exampleNumber}" name="exampleContent" type="text">
              <button type="button" id="removeExample" class="btn btn-lg btn-danger btn-xs">삭제</button>
      </div>`
    MYAPP.sequenceArr[questionNumber].push(MYAPP.exampleNumber)
    var index = MYAPP.sequenceArr[questionNumber].indexOf(Number(MYAPP.exampleNumber))+1
    console.log("2차원",MYAPP.sequenceArr);
    $("#examples_"+questionNumber).append(example);
    $("#exampleNumberText_"+MYAPP.exampleNumber).text(index)
    console.log(MYAPP.sequenceArr);
    MYAPP.exampleNumber++;
  });
  $("body").on("click", "#removeExample", function() {
    //1. '삭제'버튼의 부모노드는 찾는다.
    //2. 부모노드의 id값을 split을 이용해 추출
    //3. 그 아이디값을 sequenceArr 배열에서 index를 찾는데 사용
    //4. sequenceArr 배열에서 아이디값을 삭제
    //5. 부모노드를 삭제
    //6. 삭제고 난 후의 sequenceArr 배열에 맞게 순서 정렬
    //=> index: 보기의 번호, 값: 태그의 아이디값
    // (수정) 자료구조 = 1차원 배열 -> 2차원 배열
    var questionNumber = this.parentNode.parentNode.id.split('_')[1]
    var exampleId  = this.parentNode.id.split('_')[1]
    var exampleIndex= MYAPP.sequenceArr[questionNumber].indexOf(Number(exampleId))
    console.log(exampleIndex);
    MYAPP.sequenceArr[questionNumber].splice(exampleIndex,1);
    console.log(MYAPP.sequenceArr);
    this.parentNode.remove();
    for(var i=exampleIndex; i<MYAPP.sequenceArr[questionNumber].length; i++) {
      $("#exampleNumberText_"+MYAPP.sequenceArr[questionNumber][i]).text(i+1)
    }
  });

  $("body").on("focus", "input[name=exampleContent]", function() {
    $(this).attr('size','50')
  });
  $("body").on("blur", "input[name=exampleContent]", function() {
    $(this).removeAttr('size')
  });
})
