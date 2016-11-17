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
			userDao.isConflict(user).then(function(conflict){
				if(!conflict){
					userDao.addUncheck(user).then(resolve, reject);
				}else{
					reject({items: conflict, errors: {name: '用户名已经存在', id: '学号已被使用', email: '邮箱已被使用', phone: '手机号码已被使用'}});
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
			var count = 0;
			var propertyTotal = Object.getOwnPropertyNames(user).length;
			console.log('propertyTotal = ' + propertyTotal);
			var result = {};
			for(var property in user){
				if(user.hasOwnProperty(property) && property != 'password'){
					(function(property){
						var query = {};
						query[property] = user[property];
						console.log('query = %j', query);
						collectionHelper.collection.findOne(query, function(error, exists){
							if(error){
								reject(error);
								return;
							}
							result[property] = !exists;
							result.__atLeastOneExists__ = result.__atLeastOneExists__ || !!exists;
							count++;
							if(count >= propertyTotal){
								if(!result.__atLeastOneExists__){
									resolve(false);
								}else{
									resolve(result);
								}
							}
						});	
					})(property);
					
				}
			}
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