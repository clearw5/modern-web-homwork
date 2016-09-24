var userDao = require("./user_dao.js");



var userManager = {
	verify: function(name, password) {
		return new Promise(function(resolve){
			userDao.getUser(name, function(user){
				resolve(user && user.password == password);
			});
		});
	},

	getUser: function(name){
		return new Promise(function(resolve){
			userDao.getUser(name, function(user){
				resolve(user);
			});
		});
	},

	add: function(user){
		return new Promise(function(resolve){
			userDao.add(user, function(isOk){
				resolve({ok: isOk});
			});
		});
	}

}

module.exports = userManager;