"use strict";


var config = require('./config');


module.exports = (_config) => {

    if (!config.hasBeenInitialized) {
        config.initialize(_config);
    }

    return {
        api: require('./api'),
        web: require('./web')
    };
};