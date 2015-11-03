"use strict";

var errors = require('../api/errors');

var defaultSetting = require('./default.json');

var settings;

module.exports = {

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