var express = require('express');
var router = express.Router();



/* GET food page. */
router.post('/', function(req, res, next) {
  res.render('eat', { title: 'Express' });
});
router.get('/', function(req, res, next) {
  res.render('eat', { title: 'Express' });
});

module.exports = router;
