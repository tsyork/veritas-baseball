var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var StormpathStrategy = require('passport-stormpath');
var session = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');

//database objects
var db = require('./models/database'),
    blob = require('./models/blobs'),
    demo_request = require('./models/demo_requests'),
    ticket = require('./models/tickets'),
    message = require('./models/messages');

var routes = require('./routes/index');

//public routes
var contact = require('./routes/contact');
var requestDemo = require('./routes/request_demo');
var thanks = require('./routes/thanks');
var login = require('./routes/login');
var useCases = require('./routes/use_cases');
var terms = require('./routes/terms');
var features = require('./routes/features');

//app routes
var support = require('./routes/support');
var dashboard = require('./routes/dashboard');
var about = require('./routes/about');
var pricing = require('./routes/pricing');

//admin routes
var demo_requests = require('./routes/demo_requests')
var demoRequestDtl = require('./routes/demo_request_dtl'); //TODO: delete after demo_requests complete

//test routes
var blobs = require('./routes/blobs');

var app = express();
var strategy = new StormpathStrategy({
    expansions: 'customData'
});

passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'bower_components')));
app.use(express.static(path.join(__dirname,'resources')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: process.env.EXPRESS_SECRET, key: 'sid', cookie: {secure: false} }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//mongoose.connect('gcvauser:Magg13m0@ds059712.mongolab.com:59712/gcvanalytics');

app.use('/', routes);

//public views
app.use('/contact', contact);
app.use('/request_demo', requestDemo);
app.use('/thanks', thanks);
app.use('/login', login);
app.use('/about', about);
app.use('/pricing', pricing);
app.use('/terms', terms);
app.use('/use_cases', useCases);
app.use('/features', features);

//app views
app.use('/support', support);
app.use('/dashboard', dashboard);

//admin views
app.use('/demo_requests', demo_requests);
app.use('/demo_request_dtl', demoRequestDtl); //TODO: delete after "demo_requests" functionlity in place
app.use('/create', demoRequestDtl); //TODO: delete when new demo_requests complete

//test views
app.use('/blobs', blobs);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(9000);
module.exports = app;
