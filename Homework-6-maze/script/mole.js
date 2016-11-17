
const ROW_COUNT = 6;
const COLUMN_COUNT = 10;
const HOLE_INTERVAL = 10;
const HOLE_DIAMETER = 20;

var isGameStart = false;
var mole;
var holeContainer;
var timeElement;
var scoreElement;
var gameStateElement;
var timekeeping = new Timer(function(){
	elementValueAdd(timeElement, 1);
	if(timeElement.value == "30"){
		setGameState(false);
	}
}, 1000);

window.onload = function(){
	initGameField();
	initOtherElements();
};


function initGameField(){
	holeContainer = document.getElementById("hole_container");
	for(var i = 0; i < ROW_COUNT; i++){
		var row = document.createElement("div");
		for(var j = 0; j < COLUMN_COUNT; j++){
			row.appendChild(createHole(i, j))
		}
		holeContainer.appendChild(row);
	}
}

function createHole(row, column){
	var hole = document.createElement("div");
	hole.className = "circle hole";
	hole.onclick = onHoleClick;
	hole.style.top = row * (HOLE_DIAMETER + HOLE_INTERVAL) + "px";
	hole.style.left = column * (HOLE_DIAMETER + HOLE_INTERVAL) + "px";
	return hole;
}

function onHoleClick(){
	if(!isGameStart){
		return;
	}
	if(this == mole){
		elementValueAdd(scoreElement, 1);
		mole.className = "circle hole";
		generateMole();
	}else{
		elementValueAdd(scoreElement, -1);
	}
}

function initOtherElements(){
	timeElement = document.getElementById("time");
	scoreElement = document.getElementById("score");
	document.getElementById("start_stop").onclick = function(){
		setGameState(!isGameStart);
	};
	gameStateElement = document.getElementById("game_state");

}

function setGameState(state){
	isGameStart = state;
	if(isGameStart){
		timekeeping.start();
		gameStateElement.value = "Game Playing";
		generateMole();
	}else{
		gameStateElement.value = "Game Over";
		alert("Game Over! Your score is " + scoreElement.value);
		timekeeping.cancel();
		timeElement.value = "0";
		scoreElement.value = "0";
		mole.className = "circle hole";
	}
}

function generateMole(){
	var row = Math.floor(Math.random() * ROW_COUNT);
	var column = Math.floor(Math.random() * COLUMN_COUNT);
	mole = getHoleAt(row, column);
	mole.className = "mole circle";
}


function getHoleAt(row, column){
	return holeContainer.childNodes[row].childNodes[column];
}

function elementValueAdd(element, addend){
	var value = parseInt(element.value);
	value += addend;
	element.value = value;
}

function Timer(task, interval){
	var id = NaN;
	this.start = function(){
		id = setInterval(task, interval, arguments);
	};
	this.cancel = function(){
		if(id == id)
			clearInterval(id);
		id = NaN;
	};
}

function Schedule(task, delay){
	var id = NaN;
	this.start = function(){
		id = setTimeout(task, interval, arguments);
	};
	this.cancel = function(){
		if(id == id)
			clearTimeout(id);
		id = NaN;
	};
}


