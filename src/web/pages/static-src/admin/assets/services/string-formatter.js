"use strict";

define(function () {

    var Formatter = function StringFormatter (str) {
        this.str = str;
    };

    Formatter.slugfy = function (str) {
        return str
            .replace(/[^A-Za-z0-9 !@%\*\-_]/g, "")
            .replace(/[ ]+/g, " ")
            .trim()
            .replace(/[ ]/g, "-")
            .toLowerCase();
    };

    Formatter.prototype = {
        slugfy: function () {
            this.str = Formatter.slugfy(this.str);
            return this;
        },

        toString: function () {
            return this.str.toString();
        }
    };

    return Formatter;
});
