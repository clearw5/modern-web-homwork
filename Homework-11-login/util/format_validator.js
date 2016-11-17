
var validateRegulars = {
	phone: /^[1-9][0-9]{10}/,
    email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
};

var validateUtil = {
	validateRegular: function(str, reg){
		var r = reg.exec(str);
		return r != null && r[0].length == str.length;
	},
	validate: function(str, type){
		if(typeof(type) != 'string'){
			return validateUtil.validateRegular(str, type);
		}
		return validateUtil.validate(str, validateRegulars[type]);
	},
	validateEmail: function(email){
		return validateUtil.validate(email, 'email');
	},
	validatePhone: function(phone){
		return validateUtil.validate(phone, 'phone');
	}
}

function formatValidator(regulars, useDefault){
	if(useDefault){
		for(var field in validateRegulars){
			if(validateRegulars.hasOwnProperty(field)){
				regulars[field] = validateRegulars[field];
			}
		}
	}
	this.validate = function(obj, validateAll, errorMessages){
		var result = {};
		var valid = true;
		var errors = {};
		for(var field in regulars){
			if(!regulars.hasOwnProperty(field)){
				continue;
			}
			if(validateAll){
				result[field] = validateUtil.validate(obj[field], regulars[field]);
				valid &= result[field];
				if(errorMessages){
					errors[field] = errorMessages[field];
				}
			}else{
				if(!validateUtil.validate(obj[field], regulars[field])){
					return false;
				}
			}
		}
		if(validateAll){
			return {valid: valid, items: result, errors: errors};
		}else {
			return true;
		}
	};
}

module.exports = {Validator: formatValidator, ValidateUtil: validateUtil};