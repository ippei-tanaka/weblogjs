"use strict";


var routes = require('express').Router();
var url = require('url');
var localAuth = require('../passport-manager').localAuth;
var baseRoute = '/admin';

var isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated())
        return next();

    response.sendStatus(401);
};

var redirectIfLoggedIn = (uri) => (request, response, next) => {
    if (!request.isAuthenticated())
        return next();

    response.redirect(baseRoute + uri);
};



routes.get('/', isLoggedIn, (request, response) => {
    response.render('admin/home');
});

routes.get('/login', redirectIfLoggedIn('/'), (request, response) => {
    response.render('admin/login');
});

routes.post('/login', redirectIfLoggedIn('/'), localAuth, (request, response) => {
    response.redirect(baseRoute);
});


module.exports = {
    routes,
    baseRoute
};

