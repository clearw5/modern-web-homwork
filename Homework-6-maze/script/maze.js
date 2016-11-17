

const ProbabilityLinkToRight = 01;
const ProbabilityLinkToBottom = 0.2;
const ROW_COUNT = 3;
const COLUMN_COUNT = 3;
var maze = [];

var lastRow = [0];
for(var i = 0; i < ROW_COUNT; i++){
	var row = [];
	var nextRow = [];
	initRow(row);
	randomLinkAreaInRow(row);
	randomLinkAreaToNextRow(row, nextRow, lastRow);
	saveRow(maze, i, row, nextRow);
	lastRow = combine(lastRow, row, nextRow);
}

function saveRow(maze, ith_row, row, nextRow){
	maze[ith_row] = [];
	maze[ith_row][0] = row;
	maze[ith_row][1] = nextRow;
}

function initRow(row){
	row.splice(0, row.length);
	for(var i = 0; i < COLUMN_COUNT; i++){
		row[i] = i;
	}
}

function combine(lastRow, row, nextRow){
	var arr = [];
	for(var i = 0; i < lastRow.length; i++){
		for(var j = 0; j < row.length; j++){
			if(getStart(row, j) <= lastRow[i] && lastRow[i] <= row[j]){
				for(var k = 0; k < nextRow.length; k++){
					if(getStart(row, j) <= nextRow[k] && nextRow[k] <= row[j]){
						arr.push(nextRow[k]);
					}
				}
			}
		}
	}
	return arr;
}
function randomLinkAreaInRow(row){
	for(var i = 0; i < row.length - 1; i++){
		if(Math.random() < ProbabilityLinkToRight){
			linkToRight(row, i);
		}
	}
}

function linkToRight(row, pos){
	row[pos] = row[pos + 1];
	row.splice(pos + 1, 1);
}

function randomLinkAreaToNextRow(row, nextRow, lastRow){
	var  pos = lastRow[randomRange(0, lastRow.length - 1)];
	linkToBelow(row, nextRow, pos, 1);
	for(var i = 0; i < row.length; i++){
		if(i != pos){
			linkToBelow(row, nextRow, i, ProbabilityLinkToBottom);
		}
	}
}

function getStart(row, pos){
	if(pos == 0)
		return 0;
	return row[pos - 1] + 1;
}

function linkToBelow(row, nextRow, pos, p){
	if(Math.random() < p){
		var pos = randomRange(getStart(row, pos), row[pos]);
		nextRow.push(pos);
	}
}


function randomRange(start, end) {
	return Math.floor(Math.random() * (end + 1 - start)) + start;
} 


window.onload = function(){
	drawMaze(maze);
}

function drawMaze(maze){
	var mazeArea = document.getElementById("game_field");
	for(var i = 0; i < maze.length; i++){
		var row = maze[i][0];
		var nextRow = maze[i][1];
		console.log(row);
		console.log(nextRow);
		mazeArea.appendChild(createRow(row));
		mazeArea.appendChild(createRowWall(nextRow));
	}
}

function createRow(row, nextRow){
	var rowElement = document.createElement("div");
	rowElement.className = "row";
	drawRow(rowElement, row, nextRow);
	return rowElement;
}

function drawRow(rowElement, row, nextRow){
	rowElement.appendChild(createBlock());
	for(var i = 0; i < row.length; i++){
		var n = row[i] - getStart(row, i) + 1;
		for(var j = 0; j < 2 * n - 1; j++){
			rowElement.appendChild(createSpace());
		}
		rowElement.appendChild(createBlock());
	}
}

function createRowWall(nextRow){
	var wall = document.createElement("div");
	wall.className = "row";
	wall.appendChild(createBlock());
	for(var i = 0; i < COLUMN_COUNT; i++){
		if(nextRow.indexOf(i) >= 0){
			wall.appendChild(createSpace());
		}else{
			wall.appendChild(createBlock());
		}
		wall.appendChild(createBlock());
	}
	return wall;
}

function createBlock(){
	var block = document.createElement("div");
	block.className = "block";
	return block;
}

function createSpace(){
	var block = document.createElement("div");
	block.className = "space";
	return block;
}