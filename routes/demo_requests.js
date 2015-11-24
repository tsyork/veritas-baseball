/**
 * Created by timyork on 10/12/15.
 */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var extend = require('xtend');
var request = require('request');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

//build the REST operations at the base for demo_requests
//this will be accessible from http://127.0.0.1:3000/demo_requests if the default route for / is left unchanged
router.route('/')
    //GET all demo_requests
    .get(function(req, res, next) {
        console.log(req.user.email);
        //if (req.user.customData.isAdministrator !== 'TRUE') {
        //    return res.redirect('/login');
        //}
        //retrieve all demo_requests from Mongo
        mongoose.model('demo_request').find({}, function (err, demo_requests) {
            if (err) {
                return console.error(err);
            } else {
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    //HTML response will render the index.jade file in the views/demo_requests folder. We are also setting "demo_requests" to be an accessible variable in our jade view
                    html: function(){
                        res.render('demo_requests/index', {
                            title: 'Requests for Demos',
                            "demo_requests" : demo_requests
                        });
                    },
                    //JSON response will show all demo_requests in JSON format
                    json: function(){
                        res.json(infophotos);
                    }
                });
            }
        });
    })
    //POST a new demo_request
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var email = req.body.email;
        var other_info = req.body.other_info;
        var pref_date = req.body.pref_date;
        var subscriptions = req.body.subscriptions;
        var newsletter = req.body.newsletter;
        var priorities = req.body.priorities;

        //call the create function for our database
        mongoose.model('demo_request').create({
            email : email,
            other_info : other_info,
            pref_date : pref_date,
            subscriptions : subscriptions,
            newsletter : newsletter,
            priorities : priorities
        }, function (err, demo_request) {
            if (err) {
                res.send(err);
            } else {
                //Demo request has been created
                console.log('POST creating new demo_request: ' + demo_request);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("demo_requests");
                        // And forward to success page
                        res.redirect("/demo_requests");
                    },
                    //JSON response will show the newly created demo_request
                    json: function(){
                        res.json(demo_request);
                    }
                });
            }
        })
    });

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('demo_requests/new', { title: 'Add New Demo Request' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('demo_request').findById(id, function (err, demo_request) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(demo_request);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

//get an existing demo_request and render show.jade
router.route('/:id')
    .get(function(req, res) {
        mongoose.model('demo_request').findById(req.id, function (err, demo_request) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + demo_request._id);
                res.format({
                    html: function(){
                        res.render('demo_requests/show', {
                            "demo_request" : demo_request
                        });
                    },
                    json: function(){
                        res.json(demo_request);
                    }
                });
            }
        });
    });

//GET the individual demo_request by Mongo ID for editing
router.get('/:id/edit', function(req, res) {
    //search for the demo_request within Mongo
    mongoose.model('demo_request').findById(req.id, function (err, demo_request) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the demo_request
            console.log('GET Retrieving ID: ' + demo_request._id);
            //format the date properly for the value to show correctly in our edit form
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function(){
                    res.render('demo_requests/edit', {
                        title: 'demo_request' + demo_request._id,
                        "demo_request" : demo_request
                    });
                },
                //JSON response will return the JSON output
                json: function(){
                    res.json(demo_request);
                }
            });
        }
    });
});

//PUT to update a demo_request by ID
router.put('/:id/edit', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var email = req.body.email;
    var other_info = req.body.other_info;
    var pref_date = req.body.pref_date;
    var subscriptions = req.body.subscriptions;
    var newsletter = req.body.newsletter;
    var priorities = req.body.priorities;

    //find the document by ID
    mongoose.model('demo_request').findById(req.id, function (err, demo_request) {
        //update it
        demo_request.update({
            email : email,
            other_info : other_info,
            pref_date : pref_date,
            subscriptions : subscriptions,
            newsletter : newsletter,
            priorities : priorities
        }, function (err, demo_requestID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                        res.redirect("/demo_requests/" + demo_request._id);
                    },
                    //JSON responds showing the updated values
                    json: function(){
                        res.json(demo_request);
                    }
                });
            }
        })
    });
});

//DELETE a Demo Request by ID
router.delete('/:id/edit', function (req, res){
    //find demo_request by ID
    mongoose.model('demo_request').findById(req.id, function (err, demo_request) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            demo_request.remove(function (err, demo_request) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + demo_request._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                        html: function(){
                            res.redirect("/demo_requests");
                        },
                        //JSON returns the item with the message that is has been deleted
                        json: function(){
                            res.json({message : 'deleted',
                                item : demo_request
                            });
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;