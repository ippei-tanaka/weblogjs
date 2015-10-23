"use strict";

var db = require('../services/db');
var config = require('./config');


/**
 * @returns {Promise}
 */
var clear = () => new Promise ((resolve, reject) => {
    connect().then(() => {
        db.dropCollections()
            .then(resolve)
            .catch(reject);
    });
});


/**
 * @returns {Promise}
 */
var connect = () => {
    var settings = config.load();
    return db.connect(
        settings["database-host"],
        settings["database-name"],
        settings["database-port"]);
};


module.exports = {
    clear,
    connect
};