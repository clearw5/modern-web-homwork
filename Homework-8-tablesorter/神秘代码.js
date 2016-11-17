document.getElementsByTagName('head')[0].innerHTML += "<script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.js \"></script> ";
$('th').click(function(){
	var i = $(this).parent().children().index(this);
	var tbody = $(this).parents('table').children('tbody');
	var ascend = this._ascend = !this._ascend;
	var tr = tbody.children('tr').sort(function(a,b){ 
		var cmp = $(a).children().eq(i).text().localeCompare($(b).children().eq(i).text());
		return ascend ? -cmp : cmp;
	});
	tbody.empty().append(tr);
});