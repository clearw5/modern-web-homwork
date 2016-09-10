
const pageBarCount = 3;
var currentPageIndex = 0;
var pageBarImages = ["page_bar_bg.jpg", "black_sky.jpg", "pie.jpg"];
var pageBarTexts = ["RingShape", "Pie", "星尘计算器"];
var pageBar = document.getElementById("pageBar");
var pageBarDisplayField =  document.getElementById("pageBarDisplayField");
var centerText = document.getElementById("centerText");

document.getElementById("pageBarLeft").onclick = function(){
	setPageBarContent(currentPageIndex - 1);
}

document.getElementById("pageBarRight").onclick = function(){
	setPageBarContent(currentPageIndex + 1);
}

function setPageBarContent(index){
	if(index < 0)
		index = pageBarCount - 1;
	index %= pageBarCount;
	if(index == currentPageIndex){
		return;
	}
	currentPageIndex = index;
	pageBar.style.background = "url(\"images/" + pageBarImages[index] + "\") no-repeat";
	pageBar.style.backgroundSize = "100% 100%";
	centerText.textContent = pageBarTexts[index];
}