"use strict";

var routes = require('express').Router();
var passport = require('passport');
var url = require('url');
var BasicStrategy = require('passport-http').BasicStrategy;
var userManager = require('../../api/model-managers/user-manager');
var postManager = require('../../api/model-managers/post-manager');
var categoryManager = require('../../api/model-managers/category-manager');

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

    routes.get('/users', auth, response((ok, error, request) => {
        var urlParts = url.parse(request.url, true),
            query = urlParts.query;

        userManager.getList(query)
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

    routes.put('/users/:id', auth, response((ok, error, request) => {
        userManager.updateById(request.params.id, request.body)
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

    routes.get('/posts', auth, response((ok, error, request) => {
        var urlParts = url.parse(request.url, true),
            query = urlParts.query;

        postManager.getList(query)
            .then(ok)
            .catch(error);
    }));

    routes.get('/posts/:id', auth, response((ok, error, request) => {
        postManager.findById(request.params.id)
            .then(ok)
            .catch(error);
    }));

    routes.post('/posts', auth, response((ok, error, request) => {
        var post = Object.assign(request.body, { author: request.user._id });

        postManager.create(post)
            .then(ok)
            .catch(error);
    }));

    routes.put('/posts/:id', auth, response((ok, error, request) => {
        postManager.updateById(request.params.id, request.body)
            .then(ok)
            .catch(error);
    }));

    routes.delete('/posts/:id', auth, response((ok, error, request) => {
        postManager.removeById(request.params.id)
            .then(ok)
            .catch(error);
    }));
}


module.exports = {
    passport,
    routes
};

