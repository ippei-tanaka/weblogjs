"use strict";

var routes = require('express').Router();
var passport = require('passport');
var errors = require('../errors');
var BasicStrategy = require('passport-http').BasicStrategy;
var userManager = require('../services/user-manager');
var postManager = require('../services/post-manager');
var categoryManager = require('../services/category-manager');

//====================================================
// Passport Setting

{
    let authHandler;

    passport.use(new BasicStrategy(
        (username, password, done) => {
            authHandler(username, password, done);
        }
    ));

    // Authentication
    authHandler = (email, password, done) => {
        userManager.isValid({email: email, password: password})
            .then((user) => {
                return done(null, user);
            })
            .catch((err) => {
                return done(err);
            });
    };
}


//====================================================
// Router

{
    let auth = passport.authenticate('basic', {session: false});

    // Utility Functions
    let response = (callback) => {
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

    routes.get('/', response((ok) => {
        ok({});
    }));

    // User

    routes.get('/users', auth, response((ok, error) => {
        userManager.getList()
            .then(ok)
            .catch(error);
    }));

    routes.get('/users/:id', auth, response((ok, error, request) => {
        userManager.findById(request.params.id)
            .then(ok)
            .catch(error);
    }));

    routes.post('/users', auth, response((ok, error, request) => {
        userManager.create(request.body)
            .then(ok)
            .catch(error);
    }));

    routes.delete('/users/:id', auth, response((ok, error, request) => {
        userManager.removeById(request.params.id)
            .then(ok)
            .catch(error);
    }));

    // Category

    routes.get('/categories', auth, response((ok, error) => {
        categoryManager.getList()
            .then(ok)
            .catch(error);
    }));

    routes.get('/categories/:id', auth, response((ok, error, request) => {
        categoryManager.findById(request.params.id)
            .then(ok)
            .catch(error);
    }));

    routes.post('/categories', auth, response((ok, error, request) => {
        categoryManager.create(request.body)
            .then(ok)
            .catch(error);
    }));

    routes.put('/categories/:id', auth, response((ok, error, request) => {
        categoryManager.updateById(request.params.id, request.body)
            .then(ok)
            .catch(error);
    }));

    routes.delete('/categories/:id', auth, response((ok, error, request) => {
        categoryManager.removeById(request.params.id)
            .then(ok)
            .catch(error);
    }));

    // Post

    routes.post('/posts', auth, response((ok, error, request) => {
        var post = Object.assign(
            request.body, { author: request.user._id });

        postManager.create(post)
            .then(ok)
            .catch(error);
    }));
}


module.exports = {
    passport,
    routes
};

