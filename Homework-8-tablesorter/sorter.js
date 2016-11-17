$(function(){
	var old;
	$('th').click(function(){
		var i = $(this).parent().children().index(this);
		var tbody = $(this).parents('table').children('tbody');
		var ascend = $(this).hasClass('ascend');
		old && old.removeClass();
		$(this).removeClass().addClass(ascend ? 'descend' : 'ascend');
		var tr = tbody.children('tr').sort(function(a,b){ 
			var cmp = $(a).children().eq(i).text().localeCompare($(b).children().eq(i).text());
			return ascend ? -cmp : cmp;
		});
		tbody.empty().append(tr);
		old = $(this);
	});
});


