"use strict";


var routes = require('express').Router();
var localAuth = require('../passport-manager').localAuth;
var baseRoute = '/admin';

var isLoggedIn = (request, response, next) => {
    if (request.isAuthenticated())
        return next();

    response.redirect(baseRoute + "/login");
};

var redirectIfLoggedIn = (uri) => (request, response, next) => {
    if (!request.isAuthenticated())
        return next();

    response.redirect(baseRoute + uri);
};

var redirectIfNotLoggedIn = (uri) => (request, response, next) => {
    if (request.isAuthenticated())
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
    response.type('json').status(200).json({});
});

routes.get('/logout', redirectIfNotLoggedIn('/login'), (request, response) => {
    request.logout();
    response.redirect(baseRoute + '/login');
});

module.exports = {
    routes,
    baseRoute
};

