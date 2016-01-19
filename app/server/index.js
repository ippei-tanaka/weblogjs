"use strict";

var config = require('../config-manager').load();
var api = require('../api');
var restfulApiRouter = require('../restful-api/router');
var webpageRouter = require('../web-pages/router');
var passport = require('./passport-manager').passport;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var expressApp = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var hbs = require('express-hbs');
var expressSession = require('express-session');
var path = require('path');

var webServer;
var faviconDir = path.resolve(__dirname, '../../src/web/pages/favicons/favicon.ico');
var staticDir = path.resolve(__dirname, '../../src/web/pages/static');


var session = expressSession({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
});

expressApp.use(favicon(faviconDir));
expressApp.use(logger('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({extended: false}));
expressApp.use(cookieParser());

expressApp.use(session);

expressApp.use(passport.initialize());
expressApp.use(passport.session());

// Restful API
expressApp.use(restfulApiRouter.baseRoute, restfulApiRouter.routes);

// Static Files in pages dir
expressApp.use(express.static(staticDir));

// Web Pages
expressApp.use(webpageRouter.baseRoute, webpageRouter.routes);


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