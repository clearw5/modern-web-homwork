const PAGE_FILE_DIR = './'
const port = 3000;

var http = require('http');
var urlTool = require('url');
var template = require('./util/template.js');
template.setRoot('PAGE_FILE_DIR');
var fs = require("fs");

http.createServer(function (req, res) {
	var path = urlTool.parse(req.url).pathname;
	if(path == '/random'){
		randomNumberServer(req, res);
	}else {
		staticFileServer(req, res);
	}
}).listen(port, function(){
	console.log('server is listening at ' + port);
});

function randomNumberServer(req, res){
	var randomTime = 1000 + getRandomNumber(2000);
	var randomNumber = 1 + getRandomNumber(9);
	console.log('generate random=' + randomNumber + " delay=" + randomTime);
	setTimeout(function(){
		console.log('response random=' + randomNumber + " delay=" + randomTime);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('' + randomNumber);
	}, randomTime);
}

function staticFileServer(req, res){
	console.log("staticFileServer:" + req.url);
	if(req.url == "/"){
		redirect(res, '/S1/index.html');
	}else {
		var filepath = urlTool.parse(req.url).pathname;
		fs.readFile(PAGE_FILE_DIR + filepath, template.writeResponse(filepath, res));
	}
}

function getRandomNumber(limit){
	return Math.round(Math.random() * limit);
}

function redirect(res, url){
	res.writeHead(302, {'Location': url});
	res.end();
}