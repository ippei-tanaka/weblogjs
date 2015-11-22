"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var api = require('../../api');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;


// Home
routes.get('/',  (request, response) => {
    postManager.getList()
        .then((posts) => {
            response.render('public/home', {
                postList: posts.items
            });
        })
        .catch(() => {
            response.status(500).send('Problems have occurred.');
        });
});



module.exports = {
    routes,
    baseRoute
};

