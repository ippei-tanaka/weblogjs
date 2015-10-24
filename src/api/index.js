"use strict";

var db = require('../services/db');
var config = require('./config');
var errors = require('../errors');
var router = require('./router');
var bodyParser = require('body-parser');
var expressApp = require('express')();

/**
 * @returns {Promise}
 */
var dbClear = () => new Promise ((resolve, reject) => {
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
var dbDisconnect = () => db.disconnect();


{
    let webServer;

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
                    dbDisconnect
                        .then(resolve)
                        .catch(reject);
                }
            });
        }
    });

    expressApp.use(bodyParser.json());
    expressApp.use(router.passport.initialize());
    expressApp.use('/', router.routes);

}


module.exports = (_config) => {

    if (!config.hasBeenInitialized) {
        config.initialize(_config);
    }

    return {
        dbClear,
        dbConnect,
        startServer,
        stopServer
    };
};