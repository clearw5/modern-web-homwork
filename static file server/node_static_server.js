var static = require('node-static');

//
// Create a node-static server instance to serve the './public' folder
//
var fileServer = new static.Server('E:/web/',  {indexFile: "homepage/homework.html", cache: 3600 });

require('http').createServer(function (request, response) {
   request.addListener('end', function () {
        fileServer.serve(request, response, function (err, result) {
            if (err) { // There was an error serving the file
            	if(err.status == 404){
            		fileServer.serveFile('404/not-found.html', 404, {}, request, response);
            	}else{
            		 console.error("Error serving " + request.url + " - " + err.message);

	                // Respond to the client
	                response.writeHead(err.status, err.headers);
	                response.end();
            	}
               
            }
        });
    }).resume();
}).listen(80);