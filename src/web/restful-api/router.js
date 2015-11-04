"use strict";


var routes = require('express').Router();
var url = require('url');
var api = require('../../api');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;
//var auth = require('../passport-manager').basicAuth;
var localAuth = require('../passport-manager').localAuth;
var config = require('../../config-manager').load();
var baseRoute = `/api/v${config.api_version}`;


//-------------------------------------------------------
// Utility Functions

var response = (callback) => {
    return (request, response) => {
        var ok = (json) => {
            response.type('json').status(200).json(json);
        };
        var error = (json, code) => {
            response.type('json').status(code || 500).json(json);
        };
        callback(ok, error, request, response);
    }
};

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


//-------------------------------------------------------
// Home

routes.get('/', response((ok) => {
    ok({});
}));


//-------------------------------------------------------
// Login

routes.post('/login', redirectIfLoggedIn('/'), localAuth, response((ok) => {
    ok({});
}));


//-------------------------------------------------------
// Logout

routes.get('/logout', response((ok, error, request, response) => {
    request.logout();
    response.redirect(baseRoute + "/");
}));


//-------------------------------------------------------
// User

routes.get('/users', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    userManager.getList(query)
        .then(ok)
        .catch(error);
}));

routes.get('/users/:id', isLoggedIn, response((ok, error, request) => {
    userManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

routes.post('/users', isLoggedIn, response((ok, error, request) => {
    userManager.create(request.body)
        .then(ok)
        .catch(error);
}));

routes.put('/users/:id', isLoggedIn, response((ok, error, request) => {
    userManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

routes.delete('/users/:id', isLoggedIn, response((ok, error, request) => {
    userManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------
// Category

routes.get('/categories', isLoggedIn, response((ok, error) => {
    categoryManager.getList()
        .then(ok)
        .catch(error);
}));

routes.get('/categories/:id', isLoggedIn, response((ok, error, request) => {
    categoryManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

routes.post('/categories', isLoggedIn, response((ok, error, request) => {
    categoryManager.create(request.body)
        .then(ok)
        .catch(error);
}));

routes.put('/categories/:id', isLoggedIn, response((ok, error, request) => {
    categoryManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

routes.delete('/categories/:id', isLoggedIn, response((ok, error, request) => {
    categoryManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------
// Post

routes.get('/posts', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    postManager.getList(query)
        .then(ok)
        .catch(error);
}));

routes.get('/posts/:id', isLoggedIn, response((ok, error, request) => {
    postManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

routes.post('/posts', isLoggedIn, response((ok, error, request) => {
    var post = Object.assign(request.body, {author: request.user._id});

    postManager.create(post)
        .then(ok)
        .catch(error);
}));

routes.put('/posts/:id', isLoggedIn, response((ok, error, request) => {
    postManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

routes.delete('/posts/:id', isLoggedIn, response((ok, error, request) => {
    postManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------

module.exports = {
    routes,
    baseRoute
};

