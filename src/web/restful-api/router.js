"use strict";


var routes = require('express').Router();
var url = require('url');
var api = require('../../api');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;
var blogManager = api.blogManager;
var settingManager = api.settingManager;
//var auth = require('../passport-manager').basicAuth;
var localAuth = require('../passport-manager').localAuth;
var config = require('../../config-manager').load();
var baseRoute = `/api/v${config.api_version}`;
var co = require('co');
var helpers = require('../helpers');

//-------------------------------------------------------
// Utility Functions

var response = (callback) => {
    return (request, response) => {
        var ok = (json) => {
            response.type('json').status(200).json(json);
        };
        var error = (json, code) => {
            // TODO: change HTTP code based on the type of the error
            response.type('json').status(code || 400).json(json);
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

var redirectIfNotLoggedIn = (uri) => (request, response, next) => {
    if (request.isAuthenticated())
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

routes.get('/logout', redirectIfNotLoggedIn('/'), response((ok, error, request) => {
    request.logout();
    ok({});
}));


//-------------------------------------------------------
// User

routes.get('/users', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    userManager.find({}, helpers.parseParams(query))
        .then((data) => ok({ items: data }))
        .catch(error);
}));

routes.get('/users/me', isLoggedIn, response((ok, error, request) => {
    userManager.findById(request.user._id)
        .then(ok)
        .catch(error);
}));

routes.get('/users/:id', isLoggedIn, response((ok, error, request) => {
    userManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

routes.post('/users', isLoggedIn, response((ok, error, request) => {
    userManager.createRegularUser(request.body)
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

routes.get('/categories', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    categoryManager.find({}, helpers.parseParams(query))
        .then((data) => ok({ items: data }))
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

    query = helpers.parseParams(query);

    postManager.find({}, query)
        .then((data) => ok({ items: data }))
        .catch(error);
}));

routes.get('/posts/:id', isLoggedIn, response((ok, error, request) => {
    postManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

routes.post('/posts', isLoggedIn, response((ok, error, request) => {
    postManager.create(request.body)
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
// Blogs

routes.get('/blogs', isLoggedIn, response((ok, error, request) => {
    var urlParts = url.parse(request.url, true),
        query = urlParts.query;

    query = helpers.parseParams(query);

    blogManager.find({}, query)
        .then((data) => ok({ items: data }))
        .catch(error);
}));

routes.get('/blogs/:id', isLoggedIn, response((ok, error, request) => {
    blogManager.findById(request.params.id)
        .then(ok)
        .catch(error);
}));

routes.post('/blogs', isLoggedIn, response((ok, error, request) => {
    blogManager.create(request.body)
        .then(ok)
        .catch(error);
}));

routes.put('/blogs/:id', isLoggedIn, response((ok, error, request) => {
    blogManager.updateById(request.params.id, request.body)
        .then(ok)
        .catch(error);
}));

routes.delete('/blogs/:id', isLoggedIn, response((ok, error, request) => {
    blogManager.removeById(request.params.id)
        .then(ok)
        .catch(error);
}));


//-------------------------------------------------------
// Setting


routes.get('/setting', isLoggedIn, response((ok, error) => {
    settingManager.getSetting()
        .then(ok)
        .catch(error);
}));

routes.put('/setting', isLoggedIn, response((ok, error, request) => {
    settingManager.setFront(request.body ? request.body.front : null)
        .then(ok)
        .catch(error);
}));



//-------------------------------------------------------

module.exports = {
    routes,
    baseRoute
};

