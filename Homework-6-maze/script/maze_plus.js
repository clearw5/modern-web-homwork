

const ROW_COUNT = 15;
const COLUMN_COUNT = 15;
const STEP_COUNT = 500;

var steps = [];
var maze = [];

function nextStep(steps) {
	while (true) {
		var p = peek(steps);
		var posibility = getPosibleNextStep(p);
		removeHasTravel(steps, posibility);
		if(posibility.length > 0){
			steps.push(posibility[randomRange(0, posibility.length - 1)]);
			break;
		}else{
			pop(steps);
		}
	}
	
}

function getPosibleNextStep(p){
	var posibility = [];
	if(p[0] > 0){
		posibility.push([p[0]-1, p[1]]);
	}
	if(p[0] < COLUMN_COUNT - 1){
		posibility.push([p[0]+1, p[1]]);
	}
	if(p[1] > 0){
		posibility.push([p[0], p[1]-1]);
	}
	if(p[1] < ROW_COUNT - 1){
		posibility.push([p[0], p[1]+1]);
	}
	return posibility;
}

function removeHasTravel(steps, p){
	for(var i = 0; i < p.length; i++){
		if(contains(steps, p[i])){
			p.splice(i, 1);
			i--;
		}
	}
}

function contains(steps, step){
	for(var i = 0; i < steps.length; i++){
		if(steps[i][0] == step[0] && steps[i][1] == step[1]){
			return true;
		}
	}
	return false;
}

function peek(stack){
	return stack[stack.length - 1];
}

function pop(stack){
	stack.splice(stack.length - 1, 1);
}

function randomRange(start, end) {
	return Math.floor(Math.random() * (end + 1 - start)) + start;
} 


window.onload = function(){
	initMaze();
	drawMaze();
}

function initMaze(){
	steps.push([0, 0]);
	for(var i = 0; i < STEP_COUNT; i++){
		nextStep(steps);
		var step = peek(steps);
		if(!maze[step[0]]){
			maze[step[0]] = [];
		}
		maze[step[0]][step[1]] = true;
	}
	console.log(steps);
}

function drawMaze(){
	var mazeArea = document.getElementById("game_field");
	var canvas=document.getElementById("canvas");  
        var ctx=canvas.getContext("2d");  
        ctx.beginPath();//开始绘制路径  
        ctx.moveTo(0,0);  
	for(var i = 0; i < ROW_COUNT; i++){
		var row = createRow();
		row.appendChild(createBlock());
		for(var j = 0; j < COLUMN_COUNT; j++){
			if(maze[i] && maze[i][j]){
				row.appendChild(createSpace());
			}else{
				row.appendChild(createBlock( i == 0 && j == 0? "start" : "block"));
			}
			if(maze[i] && maze[i][j] && maze[i][j+1]){
				row.appendChild(createSpace());
			}else{
				row.appendChild(createBlock());
			}
		}
		mazeArea.appendChild(row);
		var wall =  createRow();
		wall.appendChild(createBlock());
		for(var j = 0; j < COLUMN_COUNT; j++){
			if(maze[i+1] && maze[i] && maze[i][j] && maze[i+1][j]){
				wall.appendChild(createSpace());
			}else{
				wall.appendChild(createBlock());
			}
			wall.appendChild(createBlock());
		}
		mazeArea.appendChild(wall);
		 ctx.lineTo(steps[i][0]*20, steps[i][1]*20);  
	}

       
        ctx.lineTo(290,290);  
        ctx.closePath();//结束路径  
        //下面两行是填充图形内部的代码  
        ctx.fillStyle="rgb(200,0,0)";//指定填充时使用的颜色与样式  
        ctx.fill();  
        //下面两行是绘制那个周围路径的代码  
        ctx.strokeStyle="rgb(0,0,0)";//指定路径的线颜色与样式  
        ctx.stroke();  
}

function createRow(){
	var rowElement = document.createElement("div");
	rowElement.className = "row"
	return rowElement;
}

function createBlock(className){
	var block = document.createElement("div");
	block.className = className ? className : "block";
	return block;
}

function createSpace(){
	var block = document.createElement("div");
	block.className = "space";
	return block;
}