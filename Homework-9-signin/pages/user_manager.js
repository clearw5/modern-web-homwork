
function user_manager(path) {
	this.path = path;
	this._readFromFile();
	this.users = [];
}

user_manager.prototype._readFromFile = function(){
	
};

user_manager.prototype.saveToFile = function(){
	
};


user_manager.prototype.contains = function(user){
	
};

user_manager.prototype.getUser = function(user_name){
	for(user in this.users){
		if(user.name == user_name){
			return user;
		}
	}
	return null;
};

user_manager.prototype.addUser = function(user){
	var checkInfo = isNewUserLegal(user);
	checkInfo["requestType"] = "add";
	if(checkInfo["legal"] == "true"){
		var str = JSON.stringify(user);
		users[count++] = str;
	}else{
		console.log("user illegal: %j", checkInfo);
	}
	return JSON.stringify(checkInfo);
};

user_manager.prototype.isNewUserLegal = function(user){
	
};