(function(){
	$.ajaxSetup({cache: false});

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

	function setEnable(element, enable){
		element.attr('disabled', !enable);
		if(enable){
			element.removeClass('disable').addClass('enable');
		}else {
			element.removeClass('enable').addClass('disable');
		}
	}

	$(function(){
		S1();
		var count = 0;
		$('#button').click(function(event){
			$(this).attr('disabled', true);
			event.stopImmediatePropagation();
			count = 0;
			$('.A').click();
			$('.B').click();
			$('.C').click();
			$('.D').click();
			$('.E').click();
		});

		$('.button').on('xhr_finish', function(){
			count++;
			if(count == 5){
				$('#info-bar').click();
			}
		});
	});

	function S1(){
		$('.button').click(function(event){
			event.stopImmediatePropagation();
			console.log('click:', this);
			var span = $(this).find('span').addClass('unread').removeClass('read').text('..');
			new XHR($(this), function(result){
				span.text(result);
			});
		});

		$('#info-bar').click(function(event){
			event.stopImmediatePropagation();
			console.log('click:', this);
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
		});

		
	}
})();

