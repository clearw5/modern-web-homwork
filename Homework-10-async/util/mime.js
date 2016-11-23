
var mime = new Object();


var contentTypes = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".jpg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif"
}

mime.getContentType = function(path) {
	for(var key in contentTypes){
		if(path.endsWith(key)){
			return contentTypes[key];
		}
	}
	return null;
}

module.exports = mime;	