var express = require('express');
var router = express.Router();
var userManager = require('../user_manager.js')

/* GET users listing. */
router.get('/detail', function(req, res, next) {
	console.log("detail: " + req.session.username); 
	if (!req.session.username) {
		res.redirect('/');
	} else {
		userManager.getUser(req.session.username).then(function(user){
			if(user){
				console.log("render user_detail");
				res.render('user_detail', {title: "detail", user: user});
			}else{
				res.render('login', {title: 'Login', username: req.session.username});
			}
		});
	}
});

router.post('/login', function(req, res, next){
	userManager.verify(req.body.username, req.body.password).then(function(pass){
		console.log("login: " + req.body.username);
		if(pass){
			req.session.username = req.body.username;
			res.redirect('/detail');
		}else{
			res.render('login', { title: 'Login', username: req.body.username});
		}
	});
	
});

router.post('/signin', function(req, res, next) {
	var user = {name: req.body.username, password: req.body.password, email: req.body.email, 
		phone: req.body.phone, id: req.body.id};
	userManager.add(user).then(function(){
		req.session.username = req.body.username;
		res.redirect('/detail');
	}, function(error){
		console.log("error: %j", error);
		res.redirect('/signin');
	});
});


module.exports = router;
