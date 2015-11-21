"use strict";

var config = require('./config.json');
var weblogjs = require('../')(config);

weblogjs.web.startServer()
    .then(() => weblogjs.api.userManager.createAdminUser());