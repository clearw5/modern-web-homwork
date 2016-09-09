
var http = require("http");
var server = http.createServer(staticFileServer);

server.listen(80);
console.log("Server is listening");


var fs = require("fs");
var url = require("url");
var ROOT_DIR = "../";

function staticFileServer(request, response){
	if(request.url == "/"){
		request.url = "/Homework-9-signin/pages/index.html";
	}
	var urlObj = url.parse(request.url);
	fs.readFile(ROOT_DIR + urlObj.pathname, function(error, data){
		if(error){
			response.writeHead(404);
			response.end("Page not found!");
			console.log("File read error: url=%s path=%s", request.url, urlObj.pathname);
			console.log("     error detail: " + error);
			return;
		}
		var contentType = getContentType(urlObj.pathname);
		if(contentType == null){
			response.writeHead(200);
		}else{
			response.writeHead(200, {"Content-Type": contentType});
		}
		response.end(data);
	});
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