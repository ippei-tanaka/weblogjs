"use strict";

var config = require('./config.json');
var weblogjs = require('../')(config);


/*
weblogjs.user
    .create({
        "email": "ta@exa.com",
        "password": "aokaae9@eew",
        "display-name": "Ippei Tanaka"
    });
*/

weblogjs.web.startServer()
    .then(() => weblogjs.web.createAdminUser());