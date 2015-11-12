"use strict";

define(function () {

    function Event () {
        this._callbacks = [];
    }

    Event.prototype =
    {
        fire: function () {
            var args = Array.prototype.slice.call(arguments);
            this._callbacks.forEach(function (callback) {
                callback.apply({}, args);
            }.bind(this));
        },

        on: function (callback) {
            this._callbacks.push(callback);
        },

        off: function (callback) {
            var indexes = [];

            this._callbacks.forEach(function (_callback, _index) {
                if (callback === _callback) {
                    indexes.push(_index);
                }
            }.bind(this));

            indexes.forEach(function (index) {
                delete this._callbacks[index];
            }.bind(this));
        }
    };

    return Event;
});
