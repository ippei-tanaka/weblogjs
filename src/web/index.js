"use strict";

var api = require('../api');
var configManager = require('../config-manager');
var router = require('./restful-api/router');
var bodyParser = require('body-parser');
var expressApp = require('express')();
var userManager = require('../api/model-managers/user-manager');
var webServer;
var initialized;


/**
 *
 */
var initializeApp = () => {
    if (!initialized) {
        var config = configManager.load();
        expressApp.use(bodyParser.json());
        expressApp.use(router.passport.initialize());
        expressApp.use(`/api/v${config.api_version}/`, router.routes);
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