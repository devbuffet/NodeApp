var express = require('express');
var router = express.Router();

router.get('/user/auth/:api_key', function(req, res, next) {
  res.json({api_key: process.env.api_key}); 
});

module.exports = router;
