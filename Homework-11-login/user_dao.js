
const DB_NANE = "users";
var mongodb = require('mongodb');
var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
var usersDb = new mongodb.Db(DB_NANE, mongodbServer);

var userDao = {
	add: function(user){
		var result;
		var error;
		usersDb.open(function(){
			usersDb.createCollection(DB_NANE, {safe: true}, function(err, collection){
				if(err){
					console.log("userDao: " + err);
					error = err;
				}else{
					collection.insert(user, {safe:true}, function(err, re){
						result = re;
					}); 
				}
			});
		});
		return {"result": result, "error": error};
	},
	
	remove: function(userName){
		var result;
		var error;
		collection.remove({"userName": userName},{safe:true}, function(err, re){
             error = err;
			 result = re;
        });
		return {"result": result, "error": error};
	},
	
	update: function(user, filter){
		
	},
	
	isConflict: function(user){
		
	}
	
}

module.exports = userDao;