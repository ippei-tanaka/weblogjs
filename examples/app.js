"use strict";

var weblogjs = require('../')();

weblogjs.web.startServer()
    .then(() => weblogjs.api.userManager.createAdminUser());