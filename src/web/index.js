"use strict";

var api = require('../api');
var config = require('../config');
var router = require('./restful-api/router');
var bodyParser = require('body-parser');
var expressApp = require('express')();
var userManager = require('../api/model-managers/user-manager');
var webServer;
var initialized;

/**
 * @returns {Promise}
 */
var createAdminUser = () => {
    initializeApp();

    var settings = config.load();
    return userManager.create({
        email: settings.admin_email,
        password: settings.admin_password,
        display_name: "Admin"
    });
};


/**
 * @returns {Promise}
 */
var startServer = () => new Promise((resolve, reject) => {
    initializeApp();

    var settings = config.load();
    api.db.connect()
        .then(() => {
            webServer = expressApp.listen(settings.web_server_port, settings.web_server_host,
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


/**
 *
 */
var initializeApp = () => {
    if (!initialized) {
        var settings = config.load();
        expressApp.use(bodyParser.json());
        expressApp.use(router.passport.initialize());
        expressApp.use(`/api/v${settings.api_version}/`, router.routes);
        initialized = true;
    }
};


module.exports = {
    createAdminUser,
    startServer,
    stopServer
};