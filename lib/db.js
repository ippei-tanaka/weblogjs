"use strict";

var mongoose = require('mongoose');
var config = require('../src/config-manager').load();

const DISCONNECTED = 0;
const CONNECTED = 1;
const CONNECTING = 2;
const DISCONNECTING = 3;


/**
 * @returns {Promise}
 */
var connect = (host, database, port) => new Promise((resolve, reject) => {
    var connection = mongoose.connection;

    host = host || config.database_host;
    database = database || config.database_name;
    port = port || config.database_port;

    if (mongoose.connection.readyState === CONNECTED) {
        resolve();
        return;
    }

    connection.on('error', (err) => {
        console.error("connection error:", err);
        reject(err);
    });

    connection.once('open', () => {
        resolve();
    });

    mongoose.connect(`mongodb://${host}:${port}/${database}`);
});


/**
 * @returns {Promise}
 */
var disconnect = () => new Promise((resolve, reject) => {
    mongoose.disconnect((err) => {
        !err ? resolve() : reject(err);
    });
});


/**
 * @returns {Promise}
 */
var dropCollections = () => {
    return connect().then(() => {
        var collections = mongoose.connection.collections;
        var promises = [];

        for (let name of Object.keys(collections)) {
            promises.push(new Promise((resolve, reject) => {
                collections[name].drop((err) => {
                    !err ? resolve() : reject(err);
                });
            }));
        }

        return Promise.all(promises);
    });
};


module.exports =
{
    connect,
    disconnect,
    dropCollections
};