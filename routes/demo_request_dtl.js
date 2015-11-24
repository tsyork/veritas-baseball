/**
 * Created by timyork on 10/1/15.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var DemoRequest = mongoose.model('demo_request');

/* GET form. */
router.get('/', function(req, res) {
    DemoRequest.find(function (err, demo_requests) {
        res.send(
          demo_requests
        );
        //res.render(
        //    'demo_request_dtl',
        //    {title: 'Demo Request Detail', demo_request : demo_requests}
        //);
    });
});

router.get('/:demoRequestId', function(req, res) {
    DemoRequest.find({_id: req.params.demoRequestId}, function (err, demo_requests) {
        res.send(
            demo_requests
        );
    });
});

/* POST form. */
router.post('/', function(req, res) {
    console.log(req.body.comment);
    res.redirect('demo_request_dtl');
});

module.exports = router;