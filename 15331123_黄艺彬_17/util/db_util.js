
var MongoClient = require('mongodb').MongoClient;

var DbUtil = {
	ensureCollection: function(db, collectionName){
		return new Promise(function(resolve, reject){
			DbUtil.collectionExists(db, collectionName).then(function(exists){
				if(exists){
					resolve(db.collection(collectionName));
				}else{
					DbUtil.createCollection(db, collectionName).then(function(rs){
						resolve(rs);
					}, function(rj){
						reject(rj);
					});
				}
			});
		});
	},

	collectionExists: function collectionExists(db, collectionName){
		return new Promise(function(resolve, reject){
			 // TODO justify whether collection exists
			 resolve(false); 
		});
	},

	createCollection: function(db, collectionName){
		return new Promise(function(resolve, reject){
			if(!db){
				reject('Cannot connect to db. You must start mongodb service to run this server.');
			}else{
				db.createCollection(collectionName, function(err, result){
					if(err){
						reject(err);
					}
					resolve(db.collection(collectionName));
				});
			}
			
		});
		
	}
}

function executeOperationQueue(operationQueue){
	for(var i = 0; i < operationQueue.length; i++){
		operationQueue[i]();
	}
	operationQueue.splice(0, operationQueue.length);
}



function CollectionHelper(dbName, collectionName){
	var _this = this;
	this.connected = false;
	this.operationQueue = [];
	MongoClient.connect('mongodb://localhost:27017/' + dbName, function(err, db) {
		_this.db = db;
		DbUtil.ensureCollection(db, collectionName).then(function(collection){
			_this.connected = true;
			_this.collection = collection;
			executeOperationQueue(_this.operationQueue);
		}, function(err){
			console.log("Error: " + err);
		}).catch(function(err){
			console.dir(err);
		});
	});
	
	this.execute = function(operation){
		if(!_this.connected){
			_this.operationQueue.push(operation);
		}else{
			operation();
		}
	};
	
	this.close = function(){
		_this.execute(function(){
			_this.db.logout();
		});
	};
	
}

module.exports = { DbUtil: DbUtil, CollectionHelper: CollectionHelper};
