"use strict";

var hexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

module.exports = {
    checkIfHex: function (str) {
        return hexRegExp.test(str)
    }
};