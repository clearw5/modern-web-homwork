
var links = {
	home: "http://ringshape.com",
	github: "http://github.com/hyb1996",
	homework: "http://60.205.176.122/homepage/homework.html",
	stardust_calculator: "http://shouji.baidu.com/software/9807244.html",
	blog: "http://ringshape.com/homepage/blog.html",
	phone_prohibitor: "http://ringshape.com/projects/phone_prohibitor.html",
	recipe: "http://60.205.176.122/Homework-1-recipe/pie.html",
	fifteen_puzzles: "http://60.205.176.122/Homework-7-Jigsaw/jigsaw.html",
	ring_menu: "http://60.205.176.122/Homework-3-ring-menu/index.html",
	sign_in: "http://60.205.176.122/Homework-9-signin/pages/index.html",
	right_button_signin: "http://60.205.176.122/Homework-9-signin/pages/index.html"
}

var homeworkImages = {
	recipe: "screenshoot_recipe.png",
	ring_menu: "screenshoot_ring_menu.png",
	sign_in: "screenshoot_signin.png",
	fifteen_puzzles: "screenshoot_fifteen_puzzles.png",
	login: "screenshoot_login.png"
};

var screenshoot;
var sideMenuSelectedItem;
var imageBuffer = {};

window.onload = function() {
	for(var id in links){
		setClickToLink(document.getElementById(id), links[id]);
	}
	for(var id in homeworkImages){
		var element = document.getElementById(id);
		element.onclick = function(event){
			onSideMenuClick(event.target);
		};
	}
	screenshoot = document.getElementById("homework_screenshoot");
	screenshoot.onclick = function(){
		window.location.href = links[sideMenuSelectedItem.id];
	};
	sideMenuSelectedItem = document.getElementById("recipe");
	setTimeout(preloadImages(), 500);
}

function setClickToLink(element, link){
	element.onclick = function(){
		window.location.href = link;
	}
}


function onSideMenuClick(clickedItem){
	setSideMenuSelectState(sideMenuSelectedItem, false);
	setSideMenuSelectState(clickedItem, true);
	sideMenuSelectedItem = clickedItem;
	setContentImage(clickedItem.id);
}

function setSideMenuSelectState(element, state){
	element.className = state ? "mSideMenuSelected" : "";
}

function setContentImage(id){
	if(imageBuffer[id] == undefined){
		screenshoot.src = imageBuffer[id];
	}else{
		screenshoot.src = "images/" + homeworkImages[id];
		imageBuffer[id] = screenshoot;
	}
}


function preloadImages(){
	for(var id in homeworkImages){
		loadImage(id);
	}
}

function loadImage(id){
	if(imageBuffer[id] == undefined){
		var img = new Image();
		img.src = "images/" + homeworkImages[id];
		imageBuffer[id] = img;
	}
	return imageBuffer[id];
}