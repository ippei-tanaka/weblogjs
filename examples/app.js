"use strict";

var config = require('./config.json');
var weblogjs = require('../')(config);
var co = require('co');

co(function* () {
    yield weblogjs.web.startServer();
    yield weblogjs.api.userManager.createAdminUser();
});
