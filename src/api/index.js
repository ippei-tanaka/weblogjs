"use strict";

var config = require('../config');
var db = require('./services/db');
var errors = require('./errors');
var bodyParser = require('body-parser');
var expressApp = require('express')();
var userManager = require('./model-managers/user-manager');
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
var dbDisconnect = () => db.disconnect();


module.exports = {
    dbClear,
    dbConnect,
    dbDisconnect
};