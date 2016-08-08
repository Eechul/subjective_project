var exampleNumber = function(obj) {
  var that = [];

  that.set_obj = function() {
    return that.push(obj)
  }

  return that
}
$(document).ready(function(){

  $("input[name=question_type]").change(function() {
    if($(this).val() == 'multiple_choice') {
      $('#question_type_load').load('/ajax/loadCreateQuiz.html #multiple_choice', function(responseTxt,statusTxt,xhr){
      });
    }
    else if($(this).val() == 'short_answer') {
      $('#question_type_load').load('/ajax/loadCreateQuiz.html #short_answer', function(responseTxt,statusTxt,xhr){
      });
    }
  })
  //
  $("body").on("click", "#addExample", function() {
    var numberd = exampleNumber({number : 0})
    console.log(numberd.number);
    var example =
    `<div class="checkbox">
        <label id="example">
            <input type="checkbox" value="" />
            <input type="text">
            <button type="button" id="removeExample" class="btn btn-lg btn-danger btn-xs">삭제</button>
        </label>
    </div>
    `
    $("#examples").append(example);

  });
  $("body").on("click", "#removeExample", function() {
    $(this).remove()
  });

})
