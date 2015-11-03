"use strict";

var weblogjs = require('../')();


/*
weblogjs.user
    .create({
        "email": "ta@exa.com",
        "password": "aokaae9@eew",
        "display-name": "Ippei Tanaka"
    });
*/

weblogjs.web.startServer()
    .then(() => weblogjs.api.userManager.createAdminUser());