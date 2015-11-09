"use strict";

var _event = require("lib/event");

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_event2.default.on("user-created", function () {
    console.log(12);
});

_event2.default.fire("user-created");