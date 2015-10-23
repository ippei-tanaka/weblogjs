"use strict";

var errors = require('../errors');

var defaultSetting = {
    "database-name": "weblogjs",
    "database-host": "localhost",
    "database-port": 27017,
    web_server_port: 8080,
    web_server_host: 'localhost'
};

var settings;

module.exports = {

    get hasBeenInitialized () {
        return !!settings;
    },

    initialize: (_settings) => {
        if (settings) {
            throw new errors.WeblogJsError ("Config has been already initialized.");
        }

        settings = Object.assign(defaultSetting, _settings || {});
        Object.freeze(settings);
    },

    load: () => {
        if (!settings) {
            throw new errors.WeblogJsError ("Config needs to be initialized before loaded.");
        }

        return settings;
    }
};