(function(){
	var XHR = function(button, handler){
		var xhrId = (button.data('xhr_id') || 0) + 1;
		button.data('xhrId', xhrId);
		$.get('/random', function(result){
			if(button.attr('disabled') || xhrId !== button.data('xhrId')){
				return;
			}else {
				handler.bind(button)(result);
				button.trigger('xhr_finish');
			}
		});
	}

	$(function(){
		S1();
		var random;
		$('#button').click(function(event){
			console.log('click: %j', this);
			event.stopImmediatePropagation();
			random = generateRandomButton();
			$('#message').text(random.join('→'));
			getNextButton(random).click();
		});
		$('.A').on('xhr_finish', function(){
			getNextButton(random, 'A').click();
		});
		$('.B').on('xhr_finish', function(){
			getNextButton(random, 'B').click();
		});
		$('.C').on('xhr_finish', function(){
			getNextButton(random, 'C').click();
		});
		$('.D').on('xhr_finish', function(){
			getNextButton(random, 'D').click();
		});
		$('.E').on('xhr_finish', function(){
			getNextButton(random, 'E').click();
		});
	});

	function generateRandomButton(){
		var buttons = ['A', 'B', 'C', 'D', 'E'];
		var random = [];
		while (buttons.length > 0) {
			var i = Math.floor(Math.random() * buttons.length);
			random.push(buttons[i]);
			buttons.splice(i, 1);
		}
		return random;
	}

	function getNextButton(random, className){
		if(!className){
			return $('.' + random[0]);
		}
		var i = random.indexOf(className);
		if(i < random.length - 1){
			return $('.' + random[i + 1]);
		}else {
			return $('#info-bar');
		}
	}

	function S1(){
		$('.button').click(function(event){
			event.stopImmediatePropagation();
			console.log('click: %j', this);
			if($(this).attr('disabled')){
				return;
			}
			setEnable($('.button'), false);
			setEnable($(this), true);
			var span = $(this).find('span').addClass('unread').removeClass('read').text('..');
			new XHR($(this), function(result){
				setEnable($('.button'), true);
				span.text(result);
			});
		});

		$('#info-bar').click(function(event){
			event.stopImmediatePropagation();
			console.log('click: %j', this);
			var sum = null;
			$('.button').find('span').each(function(){
				if(!$(this).hasClass('unread') || $(this).text() === '..'){
					sum = null;
					return false;
				}else{
					sum = (sum || 0) + parseInt($(this).text());
				}
			})
			if(sum != null){
				$('#sum').text(sum);
			}
		});

		$('#button').hover(function(){
			setEnable($('.button'), true);
		}, function(){
			setEnable($('.button'), false);
			$('.button').data('xhr_id', null);
			$('span').addClass('read').removeClass('unread').text('');
			$('#sum').text('');
			$('#message').text('');
		});

		function setEnable(element, enable){
			element.attr('disabled', !enable);
			if(enable){
				element.removeClass('disable').addClass('enable');
			}else {
				element.removeClass('enable').addClass('disable');
			}
		}
	}
})();

