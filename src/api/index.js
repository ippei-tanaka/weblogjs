"use strict";

var db = require('../services/db');
var config = require('./config');
var errors = require('../errors');
var router = require('./router');
var bodyParser = require('body-parser');
var expressApp = require('express')();
var userManager = require('../model-managers/user-manager');
var webServer;


/**
 * @returns {Promise}
 */
var dbClear = () => new Promise((resolve, reject) => {
    dbConnect().then(() => {
        db.dropCollections()
            .then(resolve)
            .catch(reject);
    });
});


/**
 * @returns {Promise}
 */
var dbConnect = () => {
    var settings = config.load();
    return db.connect(
        settings.database_host,
        settings.database_name,
        settings.database_port)
};

/**
 * @returns {Promise}
 */
var createAdminUser = () => {
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
var dbDisconnect = () => db.disconnect();


/**
 * @returns {Promise}
 */
var startServer = () => new Promise((resolve, reject) => {
    var settings = config.load();
    dbConnect()
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
    if (webServer) {
        webServer.close((err) => {
            if (!err) {
                dbDisconnect()
                    .then(resolve)
                    .catch(reject);
            }
        });
    }
});


/**
 *
 */
var initialize = () => {
    var settings = config.load();

    expressApp.use(bodyParser.json());
    expressApp.use(router.passport.initialize());
    expressApp.use(`/api/v${settings.api_version}/`, router.routes);
};


module.exports = (_config) => {

    if (!config.hasBeenInitialized) {
        config.initialize(_config);
    }

    initialize();

    return {
        dbClear,
        createAdminUser,
        startServer,
        stopServer
    };
};