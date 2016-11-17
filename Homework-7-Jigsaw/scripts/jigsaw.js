

（function(){
	$(function(){ new Game();});
	var View = function(){

	}
	var p = View.prototype;
	p.setStepCount = function(stepCount){
		this.stepCountText.text(stepCount);
	};
	p.setPlayedTime = function(time){
		this.playedTimeText.text(time);
	};
	p.setRestartButtonText = function(text){
		this.restart.text(text);
	}
	p.setAutoCompleteButtonText = function(text){
		autoCompleteButton.textContent = text;
	}
	p.swapPositionWithBlank = function(imageNumber){
		swapPosition(imageContainers[imageNumber], blankImage);
	};

})();

var View = function(GRID_COUNT, ROW_COUNT, COLUMN_COUNT){
	var imageContainers = [];
	var blankImage;
	var playedTimeText, stepCountText;
	var restartButton, autoCompleteButton;
	var imageField;
	var winHint;
	
	function swapPosition(imageContainer1, imageContainer2){
		var className1 = getOtherClass(imageContainer1) + getPosClass(imageContainer2);
		imageContainer2.className = getOtherClass(imageContainer2) + getPosClass(imageContainer1);
		imageContainer1.className = className1;

	}
	function getPosClass(imageContainer){
		var i = imageContainer.className.indexOf('pos_');
		if(i < 0){
			return "";
		}else {
			return imageContainer.className.substring(i);
		}
	}
	function getOtherClass(imageContainer){
		var i = imageContainer.className.indexOf('pos_');
		if(i < 0){
			return imageContainer.className;
		}else {
			return imageContainer.className.substring(0, i);
		}
	}
	this.setImagePositions = function (positions){
		for(var i = 0; i < GRID_COUNT; i++){
			setPosition(imageContainers[i], parseInt(positions[i] / COLUMN_COUNT), positions[i] % ROW_COUNT);
		}
	};
	function setPosition(imageContainer, row, column){
		var className = imageContainer.className;
		var posClass = "pos_row_" + row + " pos_col_" + column;
		var i = className.indexOf('pos_');
		if(i < 0){
			imageContainer.className += " " + posClass;
		}else {
			imageContainer.className = className.substring(0, i) + posClass;
		}
	}
	this.showPuzzleFinishAnim = function(){
		imageField.className = "puzzle_finish";
		setTimeout(function(){
			imageField.className = "";
		}, 5000);
		winHint.className = "display";
	}
	this.hideWinHint = function(){
		winHint.className = "";
	}
	this.init = function(onClick, onRestartClick, onAutoCompleteClick){
		winHint = document.getElementById("win_hint");
		blankImage =  document.getElementById("puzzle_blank");
		blankImage.onclick = onClick(GRID_COUNT - 1);
		imageField = document.getElementById("puzzles_space");
		playedTimeText = document.getElementById("played_time");
		stepCountText = document.getElementById("step_count");
		restartButton = document.getElementById("restart");
		restartButton.onclick = onRestartClick;
		autoCompleteButton = document.getElementById("auto");
		auto.onclick = onAutoCompleteClick;
		imageContainers[GRID_COUNT - 1] = blankImage;
		var images = document.getElementsByClassName("puzzle_image");
		for(var i = 0; i < GRID_COUNT - 1; i++){
			imageContainers[i] = images[i];
			imageContainers[i].onclick = onClick(i);
			setImage(imageContainers[i], parseInt(i / COLUMN_COUNT), i % ROW_COUNT);
		}
	};
	function setImage(imageContainer, row, column){
		imageContainer.className = "puzzle_image image_row_" + row + " image_col_" + column;
	}
}

var StepRecorder = function(){
	var positionStack = [];
	var stepStack = [];
	this.record = function(positions, i){
		var index = find(positions);
		if(index < 0){
			positionStack.push(positions.slice());
			stepStack.push(i);
		}else{
			positionStack.splice(index + 1, positionStack.length - index - 1);
			stepStack.splice(index + 1, stepStack.length - index - 1);
		}
	};
	this.lastStep = function(){
		return stepStack[stepStack.length - 1];
	};
	this.clear = function(){
		positionStack.length = 0;
		stepStack.length = 0;
	};
	function find(positions){
		for(var i = positionStack.length - 1; i >= 0; i--){
			if(equals(positions, positionStack[i])){
				return i;
			}
		}
		return -1;
	}
	function equals(array1, array2) {
		return array1.toString() === array2.toString();
	}

}


var Data = function(GRID_COUNT, ROW_COUNT, COLUMN_COUNT, RANDOM_STEP_COUNT, stepRecorder){
	var positions = [];
	var startTime, stepCount;
	var that = this;
	this.reset = function(){
		for(var i = 0; i < GRID_COUNT; i++){
			positions[i] = i;
		}
		startTime = new Date().getTime();
		stepCount = 0;
		stepRecorder.clear();
	};
	this.reset();
	this.getStepCount = function(){
		return stepCount;
	};
	this.countStep = function(){
		stepCount++;
	};
	this.getPlayedTime = function (){
		return new Date().getTime() - startTime;
	};
	this.getPositions = function(){
		return positions.slice();
	};
	this.isClickable = function(imageContainerNumber){
		return getPossibleNextPositions(positions[GRID_COUNT - 1]).indexOf(positions[imageContainerNumber]) >= 0;
	};
	this.isPuzzleFinished = function(){
		for(var i = 0; i < GRID_COUNT; i++){
			if(positions[i] != i){
				return false;
			}
		}
		return true;
	};
	this.disorganize = function(){
		this.reset();
		for(var i = 0; i < RANDOM_STEP_COUNT; i++){
			var possibleNextPositions = getPossibleNextPositions(positions[GRID_COUNT - 1]);
			var nextBlankPosition = possibleNextPositions[Math.floor(possibleNextPositions.length * Math.random())];
			that.setBlankImagePosition(positions.indexOf(nextBlankPosition));
		}
	};
	this.setBlankImagePosition = function(newImageContainerNumber){
		swap(positions, GRID_COUNT - 1, newImageContainerNumber);
		stepRecorder.record(positions, newImageContainerNumber);
	}
	function getPossibleNextPositions(position){
		var row = parseInt(position / COLUMN_COUNT);
		var column = position % ROW_COUNT;
		var i = 0;
		var possibleNextPositions = [];
		if(column > 0){
			possibleNextPositions[i++] = position - 1;
		}
		if(column < COLUMN_COUNT - 1){
			possibleNextPositions[i++] = position + 1;
		}
		if(row > 0){
			possibleNextPositions[i++] = position - COLUMN_COUNT;
		}
		if(row < ROW_COUNT - 1){
			possibleNextPositions[i++] = position + COLUMN_COUNT;
		}
		return possibleNextPositions;
	}


}

var Timer = function(task, delay, period){
	var intervalId, timeoutId;
	if(period){
		if(delay <= 0){
			intervalId = setInterval(task, period);
		}else{
			timeoutId = setTimeout(function(){
				intervalId = setInterval(task, period);
			}, delay);
		}
	}else{
		timeoutId = setTimeout(task, delay);
	}
	this.cancel = function(){
		if(timeoutId){
			clearTimeout(timeoutId);
		}
		if(intervalId){
			clearInterval(intervalId);
		}
	}

}


var Game = function(){
	const ROW_COUNT = 4;
	const COLUMN_COUNT = 4;
	const GRID_COUNT = ROW_COUNT * COLUMN_COUNT;
	const RANDOM_STEP_COUNT = 200;
	var isGameStart = false;
	var stepRecorder = new StepRecorder();
	var data =  new Data(GRID_COUNT, ROW_COUNT, COLUMN_COUNT, RANDOM_STEP_COUNT, stepRecorder);
	var view = new View(GRID_COUNT, ROW_COUNT, COLUMN_COUNT);
	var timekeeping;
	var autoCompleteTimer;
	this.init = function(){
		view.init(onClick, restart, onAutoCompleteClick);
		view.setImagePositions(data.getPositions());
	}
	function restart(){
		isGameStart = true;
		data.reset();
		data.disorganize(view);
		view.setImagePositions(data.getPositions());
		view.setRestartButtonText("重新开始");
		view.hideWinHint();
		syncStepCount();
		syncPlayedTime();
		if(autoCompleteTimer){
			cancelAutoComplete();
		}
		if(timekeeping){
			timekeeping.cancel();
		}
		timekeeping = new Timer(syncPlayedTime, 0, 1000);
	}
	function onClick(imageContainerNumber){
		return function(){
			console.log("onClick: " + imageContainerNumber);
			if(!isGameStart || !data.isClickable(imageContainerNumber)){
				console.log("onClick: not clickable");
				return;
			}
			data.countStep();
			syncStepCount();
			data.setBlankImagePosition(imageContainerNumber);
			view.swapPositionWithBlank(imageContainerNumber);
			if(data.isPuzzleFinished()){
			   onPuzzleFinished();
			}
		};
		
	}
	function onAutoCompleteClick(){
		if(!isGameStart){
			return;
		}
		if(autoCompleteTimer){
			cancelAutoComplete();
		}else {
			startAutoComplete();
		}
	}
	function cancelAutoComplete(){
		autoCompleteTimer.cancel();
		autoCompleteTimer = null;
		view.setAutoCompleteButtonText("自动拼图");
	}
	function startAutoComplete(){
		autoCompleteTimer = new Timer(function(){
			onClick(stepRecorder.lastStep())();
		}, 0, 500);
		view.setAutoCompleteButtonText("取消自动");
	}
	function syncStepCount(){
		view.setStepCount(data.getStepCount());
	}
	function syncPlayedTime(){
		view.setPlayedTime(parseInt(data.getPlayedTime() / 1000));
	}
	function onPuzzleFinished(){
		if(autoCompleteTimer){
			cancelAutoComplete();
		}
		isGameStart = false;
		timekeeping.cancel();
		view.showPuzzleFinishAnim();
		view.setRestartButtonText("开始游戏");
	}
};


window.onload = new Game().init;


function swap(array, i, j){
	var tmp = array[i];
	array[i] = array[j];
	array[j] = tmp;
}




