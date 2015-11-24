var express = require('express');
var router = express.Router();
var extend = require('xtend');
var request = require('request');

// Render the dashboard page.
router.get('/', function (req, res, locals) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  var tableauUser = req.user.email;
  console.log(req.user);
  console.log(req.user.customData.isAdministrator);

  request.post({url:'http://70.35.195.145:9001/api/tickets', form:{email:tableauUser}}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }

    //var ticketValue = body ;
    console.log(body);
    console.log('rendering form');

    res.render('dashboard', extend({
      title: 'My dashboard',
      user: req.user,
      ticket: body
    },locals||{}));

  });

});

module.exports = router;