const DB_NANE = "users";

var CollectionHelper = require("./util/db_util.js").CollectionHelper;
var collectionHelper = new CollectionHelper(DB_NANE, DB_NANE);

function getOrQueryExpressionForAttributes(obj){
	var attributeExpressions = [];
	for(var key in obj){
		if(obj.hasOwnProperty(key)){
			var expression = {};
			expression[key] = obj[key];
			attributeExpressions.push(expression);
		}
	}
	return {$or: attributeExpressions};
}

var userDao = {
	
	addUncheck: function(user, callback){
		collectionHelper.execute(function(){
			console.log("addUser: %j", user);
			collectionHelper.collection.insert(user, {safe:true}, function(error, result){
				if(callback){
					callback(result);
				}
			});
		});
	},
	
	add: function(user, callback){
		console.log("add");
		collectionHelper.execute(function(){
			userDao.isConflict(user, function(isConflict){
				if(!isConflict){
					userDao.addUncheck(user);
					callback(true);
				}else{
					callback(false);
				}
			});
		});
	},
	
	remove: function(userName, callback){
		collectionHelper.execute(function(){
			collectionHelper.collection.deleteOne({"name": userName}, function(err, result) {
				if(callback){
					callback(result);
				}
			});
		});
	},
	
	isConflict: function(user, callback){
		collectionHelper.execute(function(){
			for(var i = 0; i < 4; i++){
				collectionHelper.collection.findOne(getOrQueryExpressionForAttributes(user), function(error, result){
					callback(!!result);
				});
			}
		});
	},
	
	getUser: function(name, callback){
		collectionHelper.execute(function(){
			collectionHelper.collection.findOne({"name": name}, function(error, result){
				console.log(result);
				if(callback){
					callback(result);
				}
			});
		});
	},
	
	printAll: function(){
		collectionHelper.execute(function(){
			collectionHelper.collection.find({}).toArray(function(err, docs) {
				console.log(docs);
			});
		});
	},
	
	close : function(){
		collectionHelper.close();
	}
	
}

module.exports = userDao;