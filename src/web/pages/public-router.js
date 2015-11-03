"use strict";


var routes = require('express').Router();
var url = require('url');
var api = require('../../api');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;
var auth = require('../passport-manager').basicAuth;


// Home

routes.get('/',  (request, response) => {
    response.render('public-master', {
        head: {
            title: 'page title'
        },
        content: {
            title: 'post title',
            description: 'description'
        }
    });
});



module.exports = {
    routes
};

