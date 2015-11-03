"use strict";


var routes = require('express').Router();
var url = require('url');
var localAuth = require('../passport-manager').localAuth;


// Home

routes.get('/', localAuth, (request, response) => {
    response.render('admin-home');
});

routes.get('/login', (request, response) => {
    response.render('login');
});

routes.post('/login', localAuth, (request, response) => {
    response.redirect('/');
});

module.exports = {
    routes
};

