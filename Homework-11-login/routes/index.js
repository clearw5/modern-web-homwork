var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.username){
		res.redirect('/detail');
	}else{
	 	res.render('login', { title: 'Login', username: ''});
	}
});


router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Signin', user: {name: '', id: '', email: '', phone: ''}});
});


router.get('/session-demo', function(req, res, next) {
  var sess = req.session
  if (sess.views) {
    sess.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + sess.views + '</p>');
    res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>');
    res.end();
  } else {
    sess.views = 1;
    res.end('welcome to the session demo. refresh!');
  }
});

module.exports = router;
