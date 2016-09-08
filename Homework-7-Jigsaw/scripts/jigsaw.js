
const ROW_COUNT = 4;
const COLUMN_COUNT = 4;
const GRID_COUNT = ROW_COUNT * COLUMN_COUNT;
const RANDOM_STEP_COUNT = 200;

var blankImage =  document.getElementById("puzzle_blank");
var imageContainers = new Array(GRID_COUNT);
var positions = new Array(GRID_COUNT);
var startTime, stepCount;
var playedTimeText = document.getElementById("played_time");
var stepCountText = document.getElementById("step_count");

initPositionArray();
initImageContainer();
setImagePosition(positions);

function initPositionArray(){
	for(var i = 0; i < GRID_COUNT; i++){
		positions[i] = i;
	}
}

function initImageContainer(){
	imageContainers[GRID_COUNT - 1] = blankImage;
	blankImage.onclick = Function("onClick(" + (GRID_COUNT - 1) + ")");
	for(var i = 0; i < GRID_COUNT - 1; i++){
		imageContainers[i] = document.getElementById("image" + i);
		imageContainers[i].onclick = Function("onClick(" + i + ")");
		var rowAndColumn = getRowAndColumn(positions[i]);
		setImage(imageContainers[i], rowAndColumn[0], rowAndColumn[1]);
	}
}


function setImage(imageContainer, row, column){
	var xPercent = column * 100 / (COLUMN_COUNT - 1);
	var yPercent = row * 100 / (ROW_COUNT - 1);
	imageContainer.style.backgroundPosition = xPercent + "% " + yPercent + "%";
}

function setPosition(imageContainer, row, column){
	imageContainer.style.left = column * 88 + "px";
	imageContainer.style.top = row * 88 + "px";
}


function setImagePosition(positions){
	for(var i = 0; i < GRID_COUNT; i++){
		var rowAndColumn = getRowAndColumn(positions[i]);
		setPosition(imageContainers[i], rowAndColumn[0], rowAndColumn[1]);
	}
}

function onClick(imageContainerNumber){
	console.log("onClick: " + imageContainerNumber);
	if(!isClickable(imageContainerNumber)){
		console.log("onClick: not clickable");
		return;
	}
	stepCount++;
	syncStepCount();
	setBlankImagePosition(imageContainerNumber);
	swapPosition(blankImage, imageContainers[imageContainerNumber]);
	if(isPuzzleFinished()){
	   onPuzzleFinished();
	}
}

function isClickable(imageContainerNumber){
	var diff = Math.abs(positions[GRID_COUNT - 1] - positions[imageContainerNumber]);
	return diff == 1 || diff == COLUMN_COUNT;
}

function syncStepCount(){
	stepCountText.textContent =  stepCount;
}

function getPlayedTime(){
	return new Date().getTime() - startTime;
}

function setBlankImagePosition(newImageContainerNumber){
	swap(positions, GRID_COUNT - 1, newImageContainerNumber);
}

function swap(array, i, j){
	var tmp = array[i];
	array[i] = array[j];
	array[j] = tmp;
}

function swapPosition(imageContainer1, imageContainer2){
	var left = imageContainer1.style.left;
	var top = imageContainer1.style.top;
	imageContainer1.style.left = imageContainer2.style.left;
	imageContainer1.style.top = imageContainer2.style.top;
	imageContainer2.style.left = left;
	imageContainer2.style.top = top;
}

function isPuzzleFinished(){
	for(var i = 0; i < GRID_COUNT; i++){
		if(positions[i] != i){
			return false;
		}
	}
	return true;
}

function onPuzzleFinished(){
	clearInterval(timer);
	alert("You win!!");
}


function getRowAndColumn(position){
	return [parseInt(position / COLUMN_COUNT), position % ROW_COUNT];
}

function randomNextPosition(position){
	var rowAndColumn = getRowAndColumn(position);
	var i = 0;
	var possibleNextPositions = new Array();
	if(rowAndColumn[1] > 0){
		possibleNextPositions[i++] = position - 1;
	}
	if(rowAndColumn[1] < COLUMN_COUNT - 1){
		possibleNextPositions[i++] = position + 1;
	}
	if(rowAndColumn[0] > 0){
		possibleNextPositions[i++] = position - COLUMN_COUNT;
	}
	if(rowAndColumn[0] < ROW_COUNT - 1){
		possibleNextPositions[i++] = position + COLUMN_COUNT;
	}
	return possibleNextPositions[Math.floor(i * Math.random())];
}

function generateRandomPosition(){
	initPositionArray();
	for(var i = 0; i < RANDOM_STEP_COUNT; i++){
		var nextBlankPosition = randomNextPosition(positions[GRID_COUNT - 1]);
		setBlankImagePosition(nextBlankPosition);
	}
}


function onRestartClick(){
	generateRandomPosition();
	setImagePosition(positions);
	startTime = new Date().getTime();
	stepCount = 0;
	syncStepCount();
	document.getElementById("restart").textContent = "重新开始";
	setInterval(timer, 1000);
}

function onTestClick(){
	var nextBlankPosition = randomNextPosition(blankImagePosition);
	setBlankImagePosition(nextBlankPosition);
	setupImageByImagePosition();
}

function timer(){
	playedTimeText.textContent = parseInt(getPlayedTime() / 1000);
}