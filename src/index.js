"use strict";


var configManager = require('./config-manager');


module.exports = (config) => {

    configManager.initialize(config);

    return {
        api: require('./api'),
        web: require('./web')
    };
};