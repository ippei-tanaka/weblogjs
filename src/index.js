"use strict";


var configManager = require('./config-manager');


module.exports = (config) => {

    if (!configManager.hasBeenInitialized) {
        configManager.initialize(config);
    }

    return {
        api: require('./api'),
        web: require('./web'),
        config: configManager.load()
    };
};