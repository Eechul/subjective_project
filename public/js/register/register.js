var emailCheck = true; // 이메일 중복체크 상태
// form 예외처리 함수
var formSubmit = function() {
  var register_state = false;
  console.log(document.registerForm.password_input.value.length);
  if(document.registerForm.name.value === "") {
    alert('이름을 입력해 주세요~')
  } else if(document.registerForm.gender.value === "") {
    alert('성별을 선택해 주세요~')
  } else if(emailCheck) {
    alert('이메일 중복체크를 해주세요~')
  } else if(document.registerForm.password_input.value.length <8
      || document.registerForm.password_input.value.length > 20) {
    alert('비밀번호 8자리 이상 20자리 이하로 입력해 주세요~ ')
  } else if(document.registerForm.password_input.value !==
              document.registerForm.password_confirm.value ) {
    alert('비밀번호가 일치하지 않습니다~')
  } else if(document.registerForm.birthdate.value.length !== 6) {
    alert('생년월일은 6자리 입니다~')
  } else {
    register_state = true;
  }
  return register_state;
}

// 이메일 중복체크 서버 ajax 처리
var checkEmail = function() {
  $.ajax({
     url: 'http://localhost:3005/home/checkEmail',
     dataType: 'json',
     type: 'POST',
     data: {'email':$('#email').val()},
     success: function(data) {
         if ( data.result == true ) {
           $('#checkDuplicationEmail').removeClass().addClass('btn btn-danger');
           alert('중복입니다!')
           emailCheck=true
         } else {
           //이메일 형식 체크
           if(emailFormCheck($('#email').val())) {
            $('#checkDuplicationEmail').removeClass().addClass('btn btn-success');
            alert('사용가능합니다!')
            emailCheck=false
          } else {
            $('#checkDuplicationEmail').removeClass().addClass('btn btn-default');
            alert('이메일 형식을 맞춰주세요! 예) example@example.com')
            emailCheck=false
          }
         }
     }
 });
}

// 정규식을 이용한 이메일 형식 마추기 [구글링] 꼭 해석해보기
var emailFormCheck =function (strValue)
{
  var regExp = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/; //해석해보기
  //입력을 안했으면
  if(strValue.lenght == 0)
  {
    return false;
  }
  //이메일 형식에 맞지않으면
  if (!strValue.match(regExp))
  {
    return false;
  }
  return true;
}
// 비밀번호 표준 체크
// function chkPwd(str){
//   var pw = str;
//   var num = pw.search(/[0-9]/g);
//   var eng = pw.search(/[a-z]/ig);
//   var spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
//
//   if(pw.length < 8 || pw.length > 20) {
//     alert("8자리 ~ 20자리 이내로 입력해주세요.");
//     return false;
//   }
//   if(pw.search(/₩s/) != -1){
//     alert("비밀번호는 공백없이 입력해주세요.");
//     return false;
//   } if(num < 0 || eng < 0 || spe < 0 ){
//     alert("영문,숫자, 특수문자를 혼합하여 입력해주세요.");
//     return false;
//   }
//   return true;
// }
