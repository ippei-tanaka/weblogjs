"use strict";

var config = require('./config.json');
var weblogjs;

try {
    weblogjs = require('weblogjs')(config);
} catch (e) {
    weblogjs = require('../')(config);
}

weblogjs.web.startServer().then(function () {
    console.log("Web Server has started...");

    weblogjs.api.userManager.createAdminUser().then(function () {
        console.log("Admin Account was created...");
    }).catch(function (error) {
        console.error("Error occurred when creating the Admin Account: ", error);
    });

}).catch(function (error) {
    console.error("Error occurred when starting the web server: ", error);
});