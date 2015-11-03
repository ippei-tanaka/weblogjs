"use strict";


var routes = require('express').Router();
var url = require('url');
var localAuth = require('../passport-manager').localAuth;


var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    res.sendStatus(401);
};

// Home

routes.get('/', isLoggedIn, (request, response) => {
    response.render('admin-home');
});

routes.get('/login', (request, response) => {
    response.redirect('/admin/');
});


routes.post('/login', localAuth, (request, response) => {
    response.render('login');
});


routes.get('/test', (request, response) => {
    response.render('test');
});

module.exports = {
    routes
};

