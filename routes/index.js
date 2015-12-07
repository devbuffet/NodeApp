var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Test' });
});

router.get('/user/auth/:api_key', function(req, res, next) {
  res.json({api_key: process.env.api_key});
  // process.env.api_key
});

module.exports = router;
