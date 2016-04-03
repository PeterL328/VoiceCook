var express = require('express');
var router = express.Router();



/* GET food page. */
router.get('/', function(req, res, next) {
  res.render('food', { title: 'Express' });
});
router.post('/', function(req, res, next) {
  res.render('food', { title: 'Express' });
});
module.exports = router;
