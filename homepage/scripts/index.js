
var links = {
	home: "http://ringshape.com",
	github: "http://github.com/hyb1996",
	homework: "http://60.205.176.122/homepage/homework.html",
	stardust_calculator: "http://shouji.baidu.com/software/9807244.html",
	blog: "http://60.205.176.122/homepage/blog.html",
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
var screenshootContainer;
var sideMenuSelectedItem;
var imageBuffer = {};
imageBuffer.state = {};
var loadingImage;

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
	screenshootContainer = document.getElementById("image_container");
	sideMenuSelectedItem = document.getElementById("recipe");
	loadingImage = new Image();
	loadingImage.src = "images/loading.gif";
	loadingImage.onclick = function(){
		window.location.href = links[sideMenuSelectedItem.id];
	};
	setContentImage("recipe");
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

var currentImageId = 0;
function setContentImage(id){
	currentImageId = id;
	if(imageBuffer[id] != undefined){
		setScreenshootImage(imageBuffer[id]);
	}else{
		setScreenshootImage(loadingImage);
		if(imageBuffer.state[id] == "loading"){
			return;
		}
		imageBuffer.state[id] == "loading";
		setTimeout(function(){
			var img = new Image();
			img.onclick = function(){
				window.location.href = links[sideMenuSelectedItem.id];
			};
			img.src = "images/" + homeworkImages[id];
			img.onload = function(){
				imageBuffer[id] = img;
				imageBuffer.state[id] == "loaded";
				if(currentImageId == id){
					setScreenshootImage(img);
				}
			};
		}, 100);
	}
}

function setScreenshootImage(img){
	screenshoot.parentNode.replaceChild(img, screenshoot);
	screenshoot = img;
}


function preloadImages(){
	for(var id in homeworkImages){
		if(imageBuffer.state[id] != "loading"){
			loadImage(id);
		}
	}
}

function loadImage(id){
	if(imageBuffer[id] == undefined){
		var img = new Image();
		img.onclick = function(){
			window.location.href = links[sideMenuSelectedItem.id];
		};
		img.src = "images/" + homeworkImages[id];
		img.onload = function(){
			imageBuffer[id] = img;
			imageBuffer.state[id] == "loaded";
		};
	}
}