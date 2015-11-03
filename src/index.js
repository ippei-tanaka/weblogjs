"use strict";


var configManager = require('./config-manager');
var api = require('./api');
var web = require('./web');

module.exports = (config) => {

    if (!configManager.hasBeenInitialized) {
        configManager.initialize(config);
    }

    return {
        api,
        web
    };
};