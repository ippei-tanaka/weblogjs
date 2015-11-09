(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var callbacks = Object.freeze({
    'user-created': [],
    'user-updated': [],
    'user-deleted': []
});

var Event = exports.Event = (function () {
    function Event() {
        _classCallCheck(this, Event);
    }

    _createClass(Event, null, [{
        key: 'fire',
        value: function fire(name) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (!callbacks[name]) {
                throw new Error('The event, "' + name + '", doesn\'t exist.');
            }

            callbacks[name].forEach(function (callback) {
                callback.apply({}, args);
            });
        }
    }, {
        key: 'on',
        value: function on(name, callback) {

            if (!callbacks[name]) {
                throw new Error('The event, "' + name + '", doesn\'t exist.');
            }

            callbacks[name].push(callback);
        }
    }]);

    return Event;
})();

},{}],2:[function(require,module,exports){
"use strict";

var _testEvent = require("./lib/test-event");

var _testEvent2 = _interopRequireDefault(_testEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*

Event.on("user-created", () => {
    console.log(12);
});

Event.fire("user-created");
    */
console.log(_testEvent2.default);

},{"./lib/test-event":1}]},{},[2]);
