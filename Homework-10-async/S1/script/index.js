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
		$('.button').click(function(event){
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

		$('#info-bar').click(function(){
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

		function setEnable(element, enable){
			element.attr('disabled', !enable);
			if(enable){
				element.removeClass('disable').addClass('enable');
			}else {
				element.removeClass('enable').addClass('disable');
			}
		}
	});
})();

