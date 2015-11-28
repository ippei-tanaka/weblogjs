"use strict";


var db = require('./services/db');
var userManager = require('./model-managers/user-manager');
var categoryManager = require('./model-managers/category-manager');
var postManager = require('./model-managers/post-manager');
var blogManager = require('./model-managers/blog-manager');
var settingManager = require('./model-managers/setting-manager');


module.exports = {
    db,
    userManager,
    categoryManager,
    postManager,
    blogManager,
    settingManager
};