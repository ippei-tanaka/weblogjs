"use strict";


var api = require('../api');
var configManager = require('../config-manager');
var restfulApiRoutes = require('./restful-api/router').routes;
var publicPageRouter = require('./pages/public-router').routes;
var adminPageRouter = require('./pages/admin-router').routes;
var passport = require('./passport-manager').passport;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var expressApp = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var hbs = require('express-hbs');
var webServer;
var initialized;
var session = require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
});

var initializeApp = () => {
    if (!initialized) {
        var config = configManager.load();

        //app.use(favicon(__dirname + '/public/favicon.ico'));
        expressApp.use(logger('dev'));
        expressApp.use(bodyParser.json());
        expressApp.use(bodyParser.urlencoded({ extended: false }));
        expressApp.use(cookieParser());

        expressApp.use(session);

        expressApp.use(passport.initialize());
        expressApp.use(passport.session());

        // Restful API
        expressApp.use(`/api/v${config.api_version}/`, restfulApiRoutes);

        // View Template Settings
        expressApp.engine('hbs', hbs.express4({
            partialsDir: __dirname + '/pages/views/partials'
        }));
        expressApp.set('view engine', 'hbs');
        expressApp.set('views', __dirname + '/pages/views');

        // Static Files in pages dir
        expressApp.use(express.static(__dirname + '/pages/static'));

        // Web Pages
        expressApp.use('/', publicPageRouter);
        expressApp.use('/admin', adminPageRouter);

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

        initialized = true;
    }
};


/**
 * @returns {Promise}
 */
var startServer = () => new Promise((resolve, reject) => {
    initializeApp();

    var config = configManager.load();

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
    initializeApp();

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