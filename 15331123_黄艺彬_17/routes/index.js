var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.username){
    if(req.query.username){
      res.redirect('/detail?username=' + req.query.username);
    }else{
      res.redirect('/detail');
    }
	}else{
	 	res.render('index', { title: 'Login', user: {name: req.query.username} , register_error: {} });
	}
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
    res.end('welcome to the session demo. Refresh!');
  }
});


module.exports = router;
