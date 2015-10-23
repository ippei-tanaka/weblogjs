"use strict";

var user = require('./user');
var blog = require('./blog');
var db = require('./db');
var server = require('./server');
var config = require('./config');

module.exports = (_config) => {

    if (!config.hasBeenInitialized) {
        config.initialize(_config);
    }

    return {
        db,
        user,
        blog,
        server,
        setting: config.load()
    };
};