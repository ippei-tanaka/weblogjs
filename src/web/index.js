"use strict";


var api = require('../api');
var configManager = require('../config-manager');
var restfulApiRoutes = require('./restful-api/router').routes;
var publicPageRouter = require('./pages/public-router').routes;
var adminPageRouter = require('./pages/admin-router').routes;
var passport = require('./passport-manager').passport;
var bodyParser = require('body-parser');
var express = require('express');
var expressApp = express();
var mustacheExpress = require('mustache-express');
var webServer;
var initialized;


var initializeApp = () => {
    if (!initialized) {
        var config = configManager.load();

        expressApp.use(bodyParser.json());
        expressApp.use(passport.initialize());

        // Restful API
        expressApp.use(`/api/v${config.api_version}/`, restfulApiRoutes);

        // View Template Settings
        expressApp.engine('html', mustacheExpress());
        expressApp.set('view engine', 'html');
        expressApp.set('views', __dirname + '/pages/views');

        // Static Files in pages dir
        expressApp.use(express.static(__dirname + '/pages/static'));

        // Web Pages
        expressApp.use('/', publicPageRouter);
        expressApp.use('/admin', adminPageRouter);

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