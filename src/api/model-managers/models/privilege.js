"use strict";

var PRIVILEGES = Object.freeze({
    READ: "RE",
    CREATE: "CR",
    EDIT: "ED",
    GRANTED: "GR"
});

var all = Object.keys(PRIVILEGES).map((key) => PRIVILEGES[key]);

module.exports = Object.freeze(Object.assign(
    {
        get allPrivileges() {
            return all;
        }
    },
    PRIVILEGES));