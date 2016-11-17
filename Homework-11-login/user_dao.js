const DB_NANE = "users";

var CollectionHelper = require("./util/db_util.js").CollectionHelper;
var collectionHelper = new CollectionHelper(DB_NANE, DB_NANE);

function getOrQueryExpressionForAttributes(obj, exceptions){
	var attributeExpressions = [];
	for(var key in obj){
		if(obj.hasOwnProperty(key)){
			if(!exceptions || exceptions[key]){
				continue;
			}
			var expression = {};
			expression[key] = obj[key];
			attributeExpressions.push(expression);
		}
	}
	return {$or: attributeExpressions};
}

var userDao = {
	
	addUncheck: function(user){
		console.log("addUser: %j", user);
		return new Promise(function(resolve, reject){
			collectionHelper.execute(function(){
				collectionHelper.collection.insert(user, {safe:true}, function(error, result){
					if(error){
						reject(error);
					}else{
						resolve(result);
					}
				});
			});
		});
		
	},
	
	add: function(user){
		return new Promise(function(resolve, reject){
			userDao.isConflict(user).then(function(isConflict){
				if(!isConflict){
					userDao.addUncheck(user).then(resolve, reject);
				}else{
					reject({error: 'conflict'});
				}
			});
		});
	},
	
	remove: function(userName){
		return new Promise(function(resolve, reject){
			collectionHelper.execute(function(){
				collectionHelper.collection.deleteOne({"name": userName}, function(err, result) {
					if(err){
						reject(err);
					}else{
						resolve(result);
					}
				});
			});
		});
	},
	
	isConflict: function(user){
		return new Promise(function(resolve, reject){
			collectionHelper.collection.findOne(getOrQueryExpressionForAttributes(user, {password: true}), function(error, result){
				resolve(!!result);
			});
		});
	},
	
	getUser: function(name){
		return new Promise(function(resolve){
			collectionHelper.execute(function(){
				collectionHelper.collection.findOne({"name": name}, function(error, result){
					resolve(result);
				});
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
		collectionHelper.execute(function(){
			collectionHelper.close();
		});
	}
	
}

module.exports = userDao;