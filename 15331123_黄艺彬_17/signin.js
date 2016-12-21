
const PAGE_FILE_DIR = "../";

var users = new Array();
var count = 0;

var http = require("http");
var server = http.createServer(queryServer);

server.listen(8000);
console.log("Server is listening at port 8000");

var fs = require("fs");
var urlTool = require("url");

var userDao = require("./user_dao.js");
//userDao.add({"userName": "i", "id": "1"});
userDao.remove("i");
userDao.printAll();
userDao.close();

function queryServer(request, response){
	if(request.method == "GET"){
		var urlObj = urlTool.parse(request.url, true);
		var queryContent = urlObj.query;
		if(queryContent.username != undefined){
			userDetailServer(queryContent.username, request, response);
			return;
		}
	}
	postServer(request, response);
}


function userDetailServer(userName, request, response){
	var user = getUser(userName);
	if(user == null){
		writeFileToResponse("Homework-9-signin/pages/index.html", request, response);
		return;
	}
	fs.readFile(PAGE_FILE_DIR + "Homework-9-signin/pages/detail.html", function(error, data){
		if(error){
			response.writeHead(404);
			response.end("Page not found!");
			return;
		}
		response.writeHead(200, {"Content-Type": "text/html"});
		data = data.toString().replace("&userName;", userName)
				   .replace("&email;",user.email)
				   .replace("&phoneNumber;", user.phoneNumber)
				   .replace("&id;", user.id);
		response.end(data);
	});
}

function writeFileToResponse(path, request, response){
	fs.readFile(PAGE_FILE_DIR + path, function(error, data){
		if(error){
			response.writeHead(404);
			response.end("Page not found!");
			console.log("Page not found: url=" + request.url);
			return;
		}
		response.writeHead(200, {"Content-Type": getContentType(path)});
		response.end(data);
	});
}

function postServer(request, response){
	console.log("on receive post");
	if(request.method == "GET"){
		staticFileServer(request, response);
		return;
	}
	request.on("data", function(data){
		var jsonObj = JSON.parse(data);
		console.log("post data: %j", jsonObj);
		if(jsonObj.requestType == "add"){
			response.end(addUser(jsonObj["user"]));
		}else if(jsonObj.requestType == "check"){
			response.end(userLegalCheck(jsonObj["user"]));
		}else {
			console.log("    Error: Missing request type!");
		}
	});
}

function staticFileServer(request, response){
	console.log("on static file request");
	if(request.url == "/"){
		request.url = "Homework-9-signin/pages/index.html";
	}
	var pathname = parseFilePath(request.url);
	fs.readFile(pathname, function(error, data){
		if(error){
			response.writeHead(404);
			response.end("Page not found!");
			console.log("File read error: url=%s path=%s", request.url, pathname);
			console.log("     error detail: " + error);
			return;
		}
		var contentType = getContentType(pathname);
		if(contentType == null){
			response.writeHead(200);
		}else{
			response.writeHead(200, {"Content-Type": contentType});
		}
		response.end(data);
	});
}

function parseFilePath(requestUrl){
	return PAGE_FILE_DIR + urlTool.parse(requestUrl).pathname;
}

var contentTypes = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".jpg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif"
}

function getContentType(path){
	for(var key in contentTypes){
		if(path.endsWith(key)){
			return contentTypes[key];
		}
	}
	return null;
}


function addUser(user){
	var checkInfo = isNewUserLegal(user);
	checkInfo["requestType"] = "add";
	if(checkInfo["legal"] == "true"){
		var str = JSON.stringify(user);
		users[count++] = str;
	}else{
		console.log("user illegal: %j", checkInfo);
	}
	return JSON.stringify(checkInfo);
}

function userLegalCheck(user){
	var checkInfo = isNewUserLegal(user);
	checkInfo["requestType"] = "check";
	return JSON.stringify(checkInfo);
}


function isNewUserLegal(user){
	var checkInfo = {};
	var error = {};
	checkInfo["user"] = user;
	checkInfo["legal"] = "true";
	for(var i = 0; i < count; i++){
		var u = JSON.parse(users[i]);
		if(u.userName == user.userName){
			error["userName"] = "用户名已被注册";
			checkInfo.legal = "false";
		}
		if(u.id == user.id){
			error["id"] = "学号已经存在";
			checkInfo.legal = "false";
		}
		if(u.phoneNumber == user.phoneNumber){
			error["phoneNumber"] = "电话号码已经存在";
			checkInfo.legal = "false";
		}
		if(u.email == user.email){
			error["email"] = "邮箱已经存在";
			checkInfo.legal = "false";
		}
		if(checkInfo.legal == "false"){
			break;
		}
	}
	checkInfo["error"] = error;
	return checkInfo;
}

function getUser(userName){
	for(var i = 0; i < count; i++){
		var u = JSON.parse(users[i]);
		//console.log("user: %j", u);
		if(u.userName == userName){
			return u;
		}
	}
	return null;
}