/**
 * Created by timyork on 9/12/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Ticket = mongoose.model('ticket');

/* GET the routed object. */
router.get('/', function(req, res) {
  res.render('support',{
    title: 'Support Page'});
});
module.exports = router;

/* POST form. */
router.post('/', function(req, res) {
  console.log(req.body);
  Ticket.create(req.body, function(err,post){
    if(err){
      console.log("db error in POST /support:" + err);
    } else {
      res.redirect('dashboard');
    }
  });
});
