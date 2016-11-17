
var Validator = require('./util/format_validator.js').Validator;
var regulars = {
	name:  /^[a-zA-Z][a-zA-Z0-9_]{5,17}/,
	id: /^[1-9][0-9]{7}/
};

var userValidator = new Validator(regulars, true);

var userFormatValidator = {
	validate: function(user) {
		return userValidator.validate(user, true, userFormatValidator.errorMessages);
	},
	errorMessages:  {
		name: "用户名6~18位英文字母、数字或下划线，必须以英文字母开头",
		email: "邮箱格式错误",
		id: "学号8位数字，不能以0开头",
		phone: "电话11位数字，不能以0开头"
	}
};


module.exports = userFormatValidator;