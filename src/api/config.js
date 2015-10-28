"use strict";

var errors = require('../errors');

var defaultSetting = {
    database_name: "weblogjs",
    database_host: "localhost",
    database_port: 27017,
    web_server_port: 80,
    web_server_host: 'localhost'
};

var settings;

module.exports = {

    get hasBeenInitialized () {
        return !!settings;
    },

    initialize: (_settings) => {
        if (settings) {
            throw new errors.WeblogJsConfigError ("Config has been already initialized.");
        }

        settings = Object.assign(defaultSetting, _settings || {});
        Object.freeze(settings);
    },

    load: () => {
        if (!settings) {
            throw new errors.WeblogJsConfigError ("Config needs to be initialized before loaded.");
        }

        return settings;
    }
};