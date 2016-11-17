"use strict";

var input;
var result;

window.onload = function() {
	initGlobalElements();
	setupOnClickListener();
};

function initGlobalElements(){
	input = document.getElementById("input");
	result = document.getElementById("result");
}

function setupOnClickListener(){
	[].forEach.call(document.getElementsByTagName("button"), function(button){
		button.onclick = onClick;
	});
}

var isON = true;

function onClick(event){
	var text = event.target.innerText;
	if(!isON && text != "ON"){
		return;
	}
	switch(text){
		case "AC":
			result.innerText = "0";
			input.innerText = "";
			break;
		case "DEL":
			if(input.innerText.length > 0){
				input.innerText = input.innerText.substring(0, input.innerText.length - 1);	
			}
			break;
		case "=":
			calc();
			break;
		case "OFF":
			result.innerText = "";
			input.innerText = "";
			event.target.innerText = "ON";
			isON = false;
			break;
		case "ON":
			result.innerText = "0";
			event.target.innerText = "OFF";
			isON = true;
			break;
		case "×10":
			input.innerText += "e";
			break;
		default:
			input.innerText += text;
	}
	// set input 函数会自动减掉过长字符串的前面部分，因此在这里调用了一下
	setInput(input.innerText);
}

//设置屏幕输入区字符串，字符串过长时自动剪切
function setInput(str){
	str = str.toString();
	do{
		input.innerText = str;
		if(str.length > 0){
			str = str.substring(1);
		}
	}while(input.offsetWidth < input.scrollWidth);
	
}

//保存上次运算结果的变量
var ans = "0";

//设置屏幕结果区字符串，字符串过长时自动剪切
function setResult(str){
	ans = str;
	if(!isNaN(str) && str.toString().indexOf("e") > 8){
		str = str.toString();
		str = str.substring(0, 8) + str.substring(str.indexOf("e"));
	}
	str = str.toString();
	do{
		result.innerText = str;
		if(str.length > 0){
			str = str.substring(0, str.length - 1);
		}
	}while(result.offsetWidth < result.scrollWidth);
	
}


function calc(){
	try{
		setResult(eval(filter(input.innerText)));
	}catch(err){
		console.log(err);
		err = err.toString()
		result.innerText = err.substring(0, err.indexOf(':'));
	}
}

const replacements = {
	"×": "*",
	"÷": "/",
	"lg": "log10",
	"ln": "log",
	"\\^": "**",
	"√": "sqrt"
}

const math_function = ["cbrt", "log","exp", "sin", "cos", "tan", 
	  "floor", "ceil", "sqrt", "PI", "abs"];

//对算式进行处理
function filter(expression){
	expression = expression.toString();
	for(var key in replacements){
		expression = replaceAll(expression, key, replacements[key]);
	}
	//将sin,cos这些函数替换成Math.sin等等
	for(var i = 0; i < math_function.length; i++){
		expression = replaceAll(expression, math_function[i], "Math." + math_function[i]);
	}
	expression = replaceAll(expression, "Ans", ans);
	return expression;
}

function replaceAll(str, substr, replacement){
	return str.replace(new RegExp(substr,"g"), replacement);
}

//因为asin被替换成aMath.sin，所以这里需要一个aMath对象~
var aMath = {
	sin: function(x){
		return Math.asin(x);
	},
	cos: function(x){
		return Math.acos(x);
	},
	tan: function(x){
		return Math.atan(x);
	}
}