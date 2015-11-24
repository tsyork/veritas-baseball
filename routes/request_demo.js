/**
 * Created by timyork on 9/12/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DemoRequest = mongoose.model('demo_request');

/* GET the routed object. */
router.get('/', function(req, res) {
  res.render('request_demo',{
    title: 'Request a Demo'});
});
module.exports = router;

/* POST form. */
router.post('/', function(req, res) {
  console.log(req.body);
  DemoRequest.create(req.body, function(err,post){
    if(err){
      console.log("db error in POST /request_demo:" + err);
    } else {
      if (!req.user || req.user.status !== 'ENABLED') {
        res.redirect('/thanks');
      } else
        return res.redirect('/');
    }
  });
});