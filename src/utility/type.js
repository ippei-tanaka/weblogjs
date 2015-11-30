"use strict";

module.exports = {
    toInt: function (string) {
        var num = Number.parseInt(string);

        if (isNaN(num))
        {
            throw new TypeError(string + " can't be converted into Integer.");
        } else {
            return num;
        }
    },

    checkIfHex: (function () {
        var hexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
        return (str) => hexRegExp.test(str);
    })()
};