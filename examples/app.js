"use strict";

var config = require('./config.json');
var weblogjs;

try {
    weblogjs = require('weblog')(config);
} catch (e) {
    weblogjs = require('../')(config);
}

weblogjs.web.startServer().then(function () {
    weblogjs.api.userManager.createAdminUser();
});