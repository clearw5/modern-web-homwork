$(function(){
	$('.toggle').on('click', function() {
	  $('.container').stop().addClass('active');
	});

	$('.close').on('click', function() {
	  $('.container').stop().removeClass('active');
	});

	$('form').submit(function() {
		var pw = $(this).find('#password');
	    pw.val($.md5(pw.val()));
	    return true;
	});

	var fields = {
		name: {
			input: $('#name'),
			reg: /^[a-zA-Z][a-zA-Z0-9_]{5,17}/,
			error: $('#name_error'),
			hint: '用户名6~18位英文字母、数字或下划线，必须以英文字母开头'
		},
		id: {
			input: $('#id'),
			reg: /^[1-9][0-9]{7}/,
			error: $('#id_error'),
			hint: '学号8位数字，不能以0开头'
		},
		email: {
			input: $('#email'),
			reg: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
			error: $('#email_error'),
			hint: '邮箱格式错误'
		},
		phone: {
			input: $('#phone'),
			reg: /^[1-9][0-9]{10}/,
			error: $('#phone_error'),
			hint: '电话11位数字，不能以0开头'
		}
	}
	$('input').keyup(checkInputFormat);
	$('#btn_register').submit(function(){
		if(checkInputFormat()){
			return true;
		}else{
			for(var field in fields){
				if(field.input.val() == ""){
					setError(field, "不能为空");
				}
			}
		}
	});
	$('#clear').click(function(){
		for(var field in fields){
			clearError(field);
		}
	});

	function match(str, reg){
		var r = reg.exec(str);
		return r && r[0].length == str.length;
	}

	function checkInputFormat(){
		var result = true;
		for(var fieldName in fields){
			var field = fields[fieldName];
			if(field.input.val() != "" && !match(field.input.val(), field.reg)){
				setError(field, field.hint);
				result = false;
			}else{
				clearError(field);
				result = field.input.val() != "";	
			}
		}
		return result;
	}

	function setError(field, errorMsg){
		//field.input.addClass("mLineInputError");
		field.error.text(errorMsg);
	}

	function clearError(field){
		//field.input.removeClass("mLineInputError");
		field.error.text('');
	}

});

