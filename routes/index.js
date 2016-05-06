var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Test' });
});

router.get('/user/auth/:api_key', function(req, res, next) {
	console.log('param:' + req.params.api_key);
  var key = null;
  if(req.params.api_key == process.env.api_key)
  {
    key = process.env.api_key;
  }  
  res.json({api_key: key}); 
});

module.exports = router;
