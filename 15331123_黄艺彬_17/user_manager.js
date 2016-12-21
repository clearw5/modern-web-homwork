var userDao = require("./user_dao.js");
var userFormatValidator = require("./user_format_validator.js");

var userManager = {
	verify: function(name, password) {
		return new Promise(function(resolve){
			if(!name || !password){
				resolve(false);
			}else{
				userDao.getUser(name).then(function(user){
					resolve(user && user.password == password);
				});
			}
		});
	},

	getUser: function(name){
		return userDao.getUser(name);
	},

	add: function(user){
		return new Promise(function(resolve, reject){
			var validation = userFormatValidator.validate(user);
			if(!validation.valid){
				reject({items: validation.items, errors: validation.errors});
			}else{
				userDao.add(user).then(function(result){
					resolve();
				}, function(error){
					reject(error);
				});
			}
		});
	}

}

module.exports = userManager;