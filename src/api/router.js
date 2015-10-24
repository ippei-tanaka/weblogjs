"use strict";

var routes = require('express').Router();
var passport = require('passport');
var errors = require('../errors');
var BasicStrategy = require('passport-http').BasicStrategy;
var userManager = require('../services/user-manager');

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
        userManager.isValidUser({email: email, password: password})
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

    // Root
    routes.get('/', response((ok) => {
        ok({});
    }));

    // get users
    routes.get('/users', auth, response((ok, error) => {
        userManager.getUserList()
            .then(ok)
            .catch(error);
    }));


    // Create the new user
    routes.post('/users', auth, response((ok, error, request) => {
        userManager.createUser(request.body)
            .then(ok)
            .catch(error);
    }));
}


module.exports = {
    passport,
    routes
};

