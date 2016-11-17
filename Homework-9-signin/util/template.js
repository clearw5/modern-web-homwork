
var fs = require("fs");
var mime = require('./mime.js');

var template = {
	root: '',
	setRoot: function(path){
		this.root = path;
	},
	compile: function(filepath, assignments, callback){
		fs.readFile(this.root + filepath, function(error, data){
			if(error){
				console.log('template complile error when reading file: ' + error);
			}
			if(data){
				data = data.toString();
				if(assignments){
					for(var objName in assignments){
						var obj = assignments[objName];
						for(var key in obj){
							data = data.replace('&' + objName + '.' + key + ';', obj[key]);
						}
					}
				}
			}
			callback(error, data);
		});
	},
	render: function(res, filepath, assignments){
		template.compile(filepath, assignments, this.writeResponse(filepath, res));
	},
	writeResponse: function(filepath, res){
		return function(error, data){
			if(error){
				res.writeHead(404);
				res.end("Page not found!");
				console.log("File read error: url=%s path=%s", res.url, filepath);
				console.log("     error detail: " + error);
				return;
			}
			var contentType = mime.getContentType(filepath);
			if(contentType == null){
				res.writeHead(200);
			}else{
				res.writeHead(200, {"Content-Type": contentType});
			}
			res.end(data);
		}
	},
}

module.exports = template;
