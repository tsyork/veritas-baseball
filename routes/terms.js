var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//var Comment = mongoose.model('comments');

/* GET form. */
router.get('/', function(req, res) {
  res.render(
    'GCVA_Terms_Conditions',
    {title : 'GCV Analytics Terms & Conditions'}
  );
});

module.exports = router;