var express = require('express');
var router = express.Router();
var userManager = require('../user_manager.js');
var md5 = require('md5');


router.get('/regist', function(req, res, next) {
	res.render('index', { title: 'Register', register: 'active', user: {}, register_error:{} });
});

/* GET users listing. */
router.get('/detail', function(req, res, next) {
	console.log("detail: " + req.session.username); 
	if (!req.session.username) {
		res.redirect('/');
	} else {
		userManager.getUser(req.session.username).then(function(user){
			if(user){
				console.log("render user_detail");
				if(req.query.username && req.query.username !== user.name){
					res.render('user_detail', {title: "detail", user: user, message: '只能访问自己的数据'});
				}else{
					res.render('user_detail', {title: "detail", user: user});
				}
			}else{
				res.render('login', {title: 'Detail', username: req.session.username});
			}
		});
	}
});

router.post('/login', function(req, res, next){
	console.log('body: ', req.body);
	userManager.verify(req.body.username, md5(req.body.password)).then(function(pass){
		console.log("login: " + req.body.username + " pass:" + pass);
		if(pass){
			req.session.username = req.body.username;
			res.redirect('/detail');
		}else{
			res.render('index', { title: 'Login', user: {name: req.body.username}, login_error: '用户名或密码错误', register_error:{} });
		}
	});
	
});

router.post('/logout', function(req, res, next){
	delete req.session.username;
	res.redirect('/');
});

router.post('/signin', function(req, res, next) {
	var user = {name: req.body.username, password: req.body.password, email: req.body.email, 
		phone: req.body.phone, id: req.body.id};
	user.password = md5(user.password);
	userManager.add(user).then(function(){
		req.session.username = req.body.username;
		res.redirect('/detail');
	}, function(error){
		console.log("error: %j", error);
		error = parseError(error);
		user.password = '';
		res.render('index', { title: 'Register', user: user, register: 'active', register_error: error });
	});
});

function parseError(error){
	var parsedError = {};
	for(var key in error.items){
		if(!error.items[key]){
			parsedError[key] = error.errors[key];
		}
	}
	return parsedError;
}


module.exports = router;
