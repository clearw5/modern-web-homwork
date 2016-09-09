
var indexs = {"userName":1, "phoneNumber":2, "id":3, "email":4};
var names = ["userName", "phoneNumber", "id", "email"];

var userName = document.getElementById("userName");
var phoneNumber = document.getElementById("phoneNumber");
var id = document.getElementById("id");
var email = document.getElementById("email");
var inputs = [userName, phoneNumber, id, email];

var userNameErrorHint = document.getElementById("userName_error_hint");
var phoneNumberErrorHint = document.getElementById("phoneNumber_error_hint");
var idErrorHint = document.getElementById("id_error_hint");
var emailErrorHint = document.getElementById("email_error_hint");
var errorHints = [userNameErrorHint, phoneNumberErrorHint, idErrorHint, emailErrorHint];

var userNameReg = /^[a-zA-Z][a-zA-Z0-9_]{5,17}/;
var idReg = /^[1-9][0-9]{7}/;
var phoneNumberReg = /^[1-9][0-9]{10}/;
var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
var regs = [userNameReg, phoneNumberReg, idReg , emailReg];

var userNameErrorHintTextContent = "用户名6~18位英文字母、数字或下划线，必须以英文字母开头";
var phoneNumberErrorHintTextContent = "电话11位数字，不能以0开头";
var idErrorHintTextContent = "学号8位数字，不能以0开头";
var emailErrorHintTextContent = "邮箱格式错误";
var textContents = [userNameErrorHintTextContent, phoneNumberErrorHintTextContent, idErrorHintTextContent, emailErrorHintTextContent];


function inputToJson(){
	return {
		"userName": userName.value,
		"phoneNumber": phoneNumber.value,
		"id": id.value,
		"email": email.value
	};
}

function onInputChange(){
	checkInputFormat();
}

function send(requestType, user){
	var data = {};
	data["user"] = user;
	data["requestType"] = requestType;
	createHttpRequest().send(JSON.stringify(data));
}

function onFocusChange(){
	if(checkInputFormat()){
		send("check", inputToJson());
	}
}

function onRegistClick(){
	if(checkInputFormat()){
		send("add", inputToJson());
	}else{
		for(var i = 0; i < inputs.length; i++){
			if(inputs[i].value == ""){
				setError(i, "不能为空");
			}
		}
	}
}

function match(str, reg){
	var r = reg.exec(str);
	return r != null && r[0].length == str.length;
}

function checkInputFormat(){
	var result= true;
	for(var i = 0; i < inputs.length; i++){
		if(inputs[i].value != "" && !match(inputs[i].value, regs[i])){
			setError(i, textContents[i]);
			result = false;
		}else{
			clearError(i);
			result = inputs[i].value != "";	
		}
	}
	return result;
}

function onClearClick(){
	userName.value = "";
	phoneNumber.value = "";
	id.value = "";
	email.value = "";
	for(var i = 0; i < names.length; i++){
		clearError(i);
	}
}


function setError(i, errorMsg){
	inputs[i].className = "mLineInputError";
	errorHints[i].textContent = errorMsg;
}

function clearError(i){
	inputs[i].className = "mLineInput";
	errorHints[i].textContent = "";
}

function createHttpRequest(){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "http://localhost:8000/", true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				var response = JSON.parse(xhr.responseText);
				console.log("response: %j", response);
				if(response.legal == "true"){
					if(response.requestType == "add"){
						window.location.href = "http://localhost:8000/?username=" + response.user.userName;
					}else{
						for(var i = 0; i < names.length; i++){
							clearError(i);
						}
					}
				}else{
					for(var i = 0; i < names.length; i++){
						if(response.error[names[i]] != null){
							setError(i, response.error[names[i]]);
						}
					}
				}
			}
		}
	}
	return xhr;
}