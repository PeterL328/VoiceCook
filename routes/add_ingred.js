var express = require('express');
var router = express.Router();



/* GET food page. */
router.get('/', function(req, res, next) {
  res.render('add_ingred', { title: 'Express' });
});

module.exports = router;
