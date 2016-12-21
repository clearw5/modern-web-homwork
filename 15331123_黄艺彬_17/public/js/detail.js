$(function() {
	$('#logout').click(function(){
		$.post('/logout', function(){
			$(window.location).attr('href', '/');
		});
	});
});