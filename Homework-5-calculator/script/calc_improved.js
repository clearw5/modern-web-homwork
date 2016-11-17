"use strict";
(function(){
	$(function(){ new Calc(); });
	var Calc = function(){
		this.input = $('#input');
		this.result = $('#result');
		this.expression = '';
		this.parser = new Parser();
		this.initAction();
		this.listenClick();
	}
	var p = Calc.prototype;
	p.listenClick = function(){
		var that = this;
		$('.button').click(function(event){
			var action = this._action;
			action ? action.bind(that)() : that.appendInput($(this).text());
		});
	}
	p.initAction = function(){
		$('#ac')[0]._action = function(){ this.setInput(''); this.setResult('0'); };
		$('#equal')[0]._action = this.calc;
		$('#del')[0]._action = this.backspace;
		$('#power')[0]._action = function(){ this. setPowerState(!this.isON); };
		$('#exp')[0]._action = function(){ this.appendInput('e'); };
	}
	p.setInput = function(text) {
		text = text.toString();
		this.expression = text;
		do{
			this.input.text(text);
			if(text.length > 0){
				text = text.substring(1);
			}
		}while(this.input.outerWidth() < this.input.get(0).scrollWidth);
	}
	p.setResult = function(text){
		text = text.toString();
		if(!isNaN(text) && text.toString().indexOf("e") > 8){
			text = text.substring(0, 8) + text.substring(text.indexOf("e"));
		}
		do{
			this.result.text(text);
			if(text.length > 0){
				text = text.substring(0, text.length - 1);
			}
		}while(this.result.outerWidth() < this.result.get(0).scrollWidth);
	}
	p.calc = function(){
		try{
			this.setResult(this.parser.calc(this.expression));
		}catch(err){
			console.log(err);
			err = err.toString();
			this.setResult(err.substring(0, err.indexOf(':')));
		}
		this.afterEqual = true;
	}
	p.backspace = function(){
		var inputStr = this.expression;
		if(inputStr.length > 0)
			this.setInput(inputStr.substring(0, inputStr.length - 1));
	}
	p.setPowerState = function(isON){
		this.isON = isON;
		setInput('');
		setResullt(isON ? '0' : '');
	}
	p.appendInput = function(text){
		if(this.afterEqual){
			this.expression = '';
			this.afterEqual = false;
		}
		this.setInput(this.expression + text);
	}
	var Parser = function(){
		this.ans = '0';
	}
	p = Parser.prototype;
	p.replacements = {
		"×": "*",
		"÷": "/",
		"lg": "log10",
		"ln": "log",
		"\\^": "**",
		"√": "sqrt"
	}
	p.math_function = ["cbrt", "log","exp", "sin", "cos", "tan", 
		  "floor", "ceil", "sqrt", "PI", "abs"];

	p.calc = function(expression){
		this.ans = eval(this.filter(expression));
		return this.ans;
	}
	p.filter = function(expression){
		for(var key in this.replacements){
			expression = this.replaceAll(expression, key, this.replacements[key]);
		}
		for(var i = 0; i < this.math_function.length; i++){
			expression = this.replaceAll(expression, this.math_function[i], "Math." + this.math_function[i]);
		}
		expression = this.replaceAll(expression, "Ans", this.ans);
		return expression;
	}
	p.replaceAll = function (str, substr, replacement){
		return str.replace(new RegExp(substr,"g"), replacement);
	}
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
})();