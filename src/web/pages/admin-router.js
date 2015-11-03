"use strict";


var routes = require('express').Router();
var url = require('url');
var api = require('../../api');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;
var auth = require('../passport-manager').basicAuth;


// Home

routes.get('/', (request, response) => {
    response.render('login');
});


module.exports = {
    routes
};

