var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var Comment = mongoose.model('comments');

/* GET form. */
router.get('/', function(req, res) {
  res.render(
    'use_cases',
    {title : 'GCV Analytics Use Cases'}
  );
});

module.exports = router;