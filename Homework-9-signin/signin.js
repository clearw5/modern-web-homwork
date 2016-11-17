
const PAGE_FILE_DIR = "pages/";
const USER_NONE = {name: "", id:"", phone:"", email: ""};
const ERROR_NONE = {name: "", id:"", phone:"", email: ""};

var http = require("http");
var server = http.createServer(mainServer);
var fs = require("fs");
var urlTool = require("url");
var querystring = require('querystring');

server.listen(8000);
console.log("Server is listening at port 8000");

var template = require('./util/template.js');
var userManager = require("./user_manager.js");
template.setRoot(PAGE_FILE_DIR);
var fs = require("fs");
var mime = require('./util/mime.js');

function mainServer(request, response){
	if(request.method == "GET"){
		var queryContent = urlTool.parse(request.url, true).query;
		if(queryContent.username){
			userDetailServer(queryContent.username, request, response);
		}else {
			staticFileServer(request, response);
		}
	} else {
		postServer(request, response);	
	}
}


function userDetailServer(userName, request, response){
	console.log("userDetailServer: " + userName); 
	if (!userName) {
		res.redirect('/');
	} else {
		userManager.getUser(userName).then(function(user){
			if(user){
				console.log("render user detail: user: %j", user);
				template.render(response, 'detail.html', {user: user});
			}else{
				template.render(response, 'signin.html', {user: {name: userName, id:"", phone:"", email: ""}, error: ERROR_NONE});
			}
		});
	}
}

function postServer(req, res){
	req.on('data', function(data){
		var parse =  querystring.parse(data.toString());
		var user = {name: parse.name, id: parse.id, phone: parse.phone, email: parse.email};
		console.log('postServer: user=%j', user);
		userManager.add(user).then(function(){
			console.log('add user succeed. redirect to detail');
			redirect(res, 'detail?username=' + user.name);
		}, function(error){
			console.log("postServer error: %j", error);
			errorHints = {};
			for(var field in error.errors){
				errorHints[field] = error.items[field] ? "" : error.errors[field];
			}
			template.render(res, 'signin.html', {user: user, error: errorHints});
		});
	});
	
}

function staticFileServer(req, res){
	console.log("staticFileServer:" + req.url);
	if(req.url == "/"){
		template.render(res, 'signin.html', {user: USER_NONE, error: ERROR_NONE});
	}else {
		var filepath = urlTool.parse(req.url).pathname;
		fs.readFile(PAGE_FILE_DIR + filepath, template.writeResponse(filepath, res));
	}
}

function redirect(res, url){
	res.writeHead(302, {'Location': url});
	res.end();
}
