"use strict";

define(function () {

    var callbacks = Object.freeze({
        'user-created': [],
        'user-updated': [],
        'user-deleted': []
    });

    function EventManager () {}

    EventManager.prototype =
    {
        _parseNames: function (names) {
            if (typeof names !== "string") {
                throw new Error("Event Names should be string.");
            }
            return names.trim().split(/[,\s]+/);
        },

        _checkEventName: function (name) {
            if (!callbacks[name]) {
                throw new Error(`The event, "${name}", doesn't exist.`);
            }
        },

        _fire: function (name, args) {
            this._checkEventName(name);

            callbacks[name].forEach((callback) => {
                callback.apply({}, args);
            });
        },

        _on: function (name, callback) {
            this._checkEventName(name);

            callbacks[name].push(callback);
        },

        fire: function (names, args) {
            this._parseNames(names).forEach(function (name) {
                this._fire(name, args);
            }.bind(this));
        },

        on: function (names, callback) {
            this._parseNames(names).forEach(function (name) {
                this._on(name, callback);
            }.bind(this));
        }
    };

    return new EventManager();
});
