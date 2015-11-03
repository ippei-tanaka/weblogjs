"use strict";


var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var api = require('../api');
var authHandler;
var basicAuth;


authHandler = (email, password, done) => {
    api.userManager.isValid({email: email, password: password})
        .then((user) => {
            return done(null, user);
        })
        .catch((err) => {
            return done(err);
        });
};


passport.use(new BasicStrategy(
    (username, password, done) => {
        authHandler(username, password, done);
    }
));


basicAuth = passport.authenticate('basic', {session: false});


module.exports = {
    passport,
    basicAuth
};