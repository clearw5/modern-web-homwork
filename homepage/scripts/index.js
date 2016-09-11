
var links = {
	home: "http://ringshape.com",
	github: "http://github.com/hyb1996",
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
var sideMenuSelectedItem;
var sideMenu;
var isSideMenuVisible = true;
var imageBuffer = {};
imageBuffer.state = {};
var loadingImage;

window.onload = function() {
	initElements();
	setupClickListener();
	setContentImage("recipe");
	//setTimeout(preloadImages, 100);
}


function initElements(){
	screenshoot = document.getElementById("homework_screenshoot");
	sideMenuSelectedItem = document.getElementById("recipe");
	sideMenu = document.getElementById("side_menu");
	loadingImage = new Image();
	loadingImage.src = "images/loading.gif";
}

function setupClickListener(){
	for(var id in links){
		setClickToLink(document.getElementById(id), links[id]);
	}

	for(var id in homeworkImages){
		var element = document.getElementById(id);
		element.onclick = function(event){
			onSideMenuClick(event.target);
		};
	}

	document.getElementById("homework").onclick = function(){
		this.className = isSideMenuVisible ? "" : "mNavigationSelected";
		onSideMenuDrag();
	};

	loadingImage.onclick = function(){
		window.location.href = links[sideMenuSelectedItem.id];
	};
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
			loadImage(id, function(img){
					if(currentImageId == id){
						setScreenshootImage(img);
					}
				});
		}, 100);
	}
}

function setScreenshootImage(img){
	screenshoot.parentNode.replaceChild(img, screenshoot);
	screenshoot = img;
}


function loadImage(id, callback){
	if(imageBuffer[id] != undefined || imageBuffer.state[id] == "loading"){
		return;
	}
	var img = new Image();
	img.onclick = function(){
		window.location.href = links[sideMenuSelectedItem.id];
	};
	img.src = "images/" + homeworkImages[id];
	img.onload = function(){
		imageBuffer[id] = img;
		imageBuffer.state[id] == "loaded";
		callback(img);
	};
	img.onerror = function(){
		img.src = "images/sorry-middle.jpg";
	};
}


function onSideMenuDrag(){
	isSideMenuVisible = !isSideMenuVisible;
	document.getElementById("content").style.marginLeft = isSideMenuVisible ? "175px" : "0px";
	sideMenu.style.left =  isSideMenuVisible ? "0px" : "-350px";
}

function preloadImages(){
	for(var id in homeworkImages){
		loadImage(id, function(img){});
	}
}