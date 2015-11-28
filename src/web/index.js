"use strict";

var config = require('../config-manager').load();
var api = require('../api');
var restfulApiRouter = require('./restful-api/router');
var publicPageRouter = require('./pages/public-router');
var adminPageRouter = require('./pages/admin-router');
var passport = require('./passport-manager').passport;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var expressApp = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var hbs = require('express-hbs');
var expressSession = require('express-session');
var helpers = require('./pages/views/helpers');
var webServer;


var session = expressSession({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
});

expressApp.use(favicon(__dirname + '/favicons/favicon.ico'));
expressApp.use(logger('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(cookieParser());

expressApp.use(session);

expressApp.use(passport.initialize());
expressApp.use(passport.session());

// Restful API
expressApp.use(restfulApiRouter.baseRoute, restfulApiRouter.routes);

// Set up helpers
Object.keys(helpers).forEach(function (key) {
    hbs.registerHelper(key, function () {
        var str = helpers[key].apply(null, arguments);
        return new hbs.SafeString(str);
    });
});

// HandleBar Template Settings
expressApp.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/pages/views/partials'
}));
expressApp.set('view engine', 'hbs');
expressApp.set('views', __dirname + '/pages/views/pages');

// Static Files in pages dir
expressApp.use(express.static(__dirname + '/pages/static'));

// Web Pages
expressApp.use(adminPageRouter.baseRoute, adminPageRouter.routes);
expressApp.use(publicPageRouter.baseRoute, publicPageRouter.routes);

/*
 // catch 404 and forward to error handler
 app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
 });

 // error handlers

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
 */


/**
 * @returns {Promise}
 */
var startServer = () => new Promise((resolve, reject) => {
    api.db.connect()
        .then(() => {
            webServer = expressApp.listen(config.web_server_port, config.web_server_host,
                (err) => {
                    !err ? resolve() : reject(err);
                });
        });
});

/**
 * @returns {Promise}
 */
var stopServer = () => new Promise((resolve, reject) => {
    if (webServer) {
        webServer.close((err) => {
            if (!err) {
                api.db.disconnect()
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
});


module.exports = {
    startServer,
    stopServer
};