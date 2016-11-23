(function(){

	var XHR = function(button, handler){
		var xhrId = (button.data('xhr_id') || 0) + 1;
		button.data('xhrId', xhrId);
		$.get('/random', function(result){
			if(button.attr('disabled') || xhrId !== button.data('xhrId')){
				return;
			}else {
				handler.bind(button)(result);
			}
		});
	}

	$(function(){
		$('#button').hover(function(){
			setEnable($('.button'), true);
		}, function(){
			setEnable($('.button'), false);
			$('.button').data('xhr_id', null);
			$('span').addClass('read').removeClass('unread').text('');
			$('#sum').text('');
			$('#message').text('');
			$('#random').text('');
		});

		
		$('#button').click(function(event){
			console.log('click:', this);
			event.stopImmediatePropagation();
			var letterArray = generateRandomButton();
			$('#random').text(letterArray.join('→'));
			letterArray.push('bubble');
			console.log('letterArray=', letterArray);
			functionByName(letterArray[0] + 'Handler').bind(getButtonAt(letterArray, 0))(0, getCallback(letterArray, 0));
		});
	});

	function getCallback(letterArray, i){
		return function(error, result){
			if(error){
				showMessage(neg(error.message));
				functionByName(letterArray[i] + 'Handler').bind(getButtonAt(letterArray, i))(result, arguments.callee);
				return;
			}
			if(i < letterArray.length - 1){
				functionByName(letterArray[i + 1] + 'Handler').bind(getButtonAt(letterArray, i + 1))(result, getCallback(letterArray, i + 1));
			}
		}
	}

	function generateRandomButton(){
		var letters = ['A', 'B', 'C', 'D', 'E'];
		var random = [];
		while (letters.length > 0) {
			var i = Math.floor(Math.random() * letters.length);
			random.push(letters[i]);
			letters.splice(i, 1);
		}
		return random;
	}

	function getButtonAt(letterArray, i){
		if(i < letterArray.length - 1){
			return $('.' + letterArray[i]);
		}else {
			return $('#info-bar');
		}
	}
	
	
	function functionByName(name){
		if(name === 'bubbleHandler')
			return bubbleHandler;
		return {
			A: AHandler,
			B: BHandler,
			C: CHandler,
			D: DHandler,
			E: EHandler,
		}[name[0]];
	}

	function showMessage(message){
		console.log('showMessage', message);
		$('#message').text(message);
	}

	function neg(message){
		return {
			'我不知道': '我知道',
			'你不知道': '你知道',
			'他不知道': '他知道',
			'才怪': '一点儿不怪',
			'这是个天大的秘密': '这是个众所周知的事情'
		}[message];
	}

	function setEnable(element, enable){
		element.attr('disabled', !enable);
		if(enable){
			element.removeClass('disable').addClass('enable');
		}else {
			element.removeClass('enable').addClass('disable');
		}
	}

	function randomError(){
		return Math.random() > 0.5;
	}

	function AHandler(currentSum, callback){
		console.log('click:', this);
		if($(this).attr('disabled')){
			return;
		}
		setEnable($('.button'), false);
		setEnable($(this), true);
		var span = this.find('span').addClass('unread').removeClass('read').text('..');
		new XHR(this, function(result){
			setEnable($('.button'), true);
			span.text(result);
			console.log('currentSum=' + currentSum);
			var message = '这是个天大的秘密';
			if(randomError()){
				callback(new Error(message), currentSum);
			}else {
				currentSum += parseInt(result);
				showMessage(message);
				callback(null, currentSum);
			}
		});
	}

	function BHandler(currentSum, callback){
		console.log('click:', this);
		if($(this).attr('disabled')){
			return;
		}
		setEnable($('.button'), false);
		setEnable($(this), true);
		var span = this.find('span').addClass('unread').removeClass('read').text('..');
		new XHR(this, function(result){
			setEnable($('.button'), true);
			span.text(result);
			console.log('currentSum=' + currentSum);
			var message = '我不知道';
			if(randomError()){
				callback(new Error(message), currentSum);
			}else {
				currentSum += parseInt(result);
				showMessage(message);
				callback(null, currentSum);
			}
		});
	}

	function CHandler(currentSum, callback){
		console.log('click:', this);
		if($(this).attr('disabled')){
			return;
		}
		setEnable($('.button'), false);
		setEnable($(this), true);
		var span = this.find('span').addClass('unread').removeClass('read').text('..');
		new XHR(this, function(result){
			setEnable($('.button'), true);
			span.text(result);
			console.log('currentSum=' + currentSum);
			var message = '你不知道';
			if(randomError()){
				callback(new Error(message), currentSum);
			}else {
				currentSum += parseInt(result);
				showMessage(message);
				callback(null, currentSum);
			}
		});
	}

	function DHandler(currentSum, callback){
		console.log('click:', this);
		if($(this).attr('disabled')){
			return;
		}
		setEnable($('.button'), false);
		setEnable($(this), true);
		var span = this.find('span').addClass('unread').removeClass('read').text('..');
		new XHR(this, function(result){
			setEnable($('.button'), true);
			span.text(result);
			console.log('currentSum=' + currentSum);
			var message = '他不知道';
			if(randomError()){
				callback(new Error(message), currentSum);
			}else {
				currentSum += parseInt(result);
				showMessage(message);
				callback(null, currentSum);
			}
		});
	}

	function EHandler(currentSum, callback){
		console.log('click:', this);
		if($(this).attr('disabled')){
			return;
		}
		setEnable($('.button'), false);
		setEnable($(this), true);
		var span = this.find('span').addClass('unread').removeClass('read').text('..');
		new XHR(this, function(result){
			setEnable($('.button'), true);
			span.text(result);
			console.log('currentSum=' + currentSum);
			var message = '才怪';
			if(randomError()){
				callback(new Error(message), currentSum);
			}else {
				currentSum += parseInt(result);
				showMessage(message);
				callback(null, currentSum);
			}
		});
	}

	function bubbleHandler(currentSum, callback){
		console.log('click:', this);
		if($(this).attr('disabled')){
			return;
		}
		setEnable($('.button'), true);
		setEnable($(this), true);
		$('#sum').text('' + currentSum);
		var message = '楼主异步调用战斗力感人，目测不超过' + currentSum;
		if(randomError()){
			callback(new Error(message), currentSum);
		}else {
			showMessage(message);
			callback(null, currentSum);
		}
	}

})();

	