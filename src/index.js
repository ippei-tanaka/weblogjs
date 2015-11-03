"use strict";


var config = require('./config');
var api = require('./api');
var web = require('./web');

module.exports = (_config) => {

    if (!config.hasBeenInitialized) {
        config.initialize(_config);
    }

    return {
        api,
        web
    };
};