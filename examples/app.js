"use strict";

var settings = require('./settings.json');
var weblogjs = require('../')(settings);


/*
weblogjs.user
    .create({
        "email": "ta@exa.com",
        "password": "aokaae9@eew",
        "display-name": "Ippei Tanaka"
    });
*/

weblogjs.server.start();