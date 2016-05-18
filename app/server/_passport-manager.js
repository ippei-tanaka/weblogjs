"use strict";


var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var co = require('co');
var authHandler;
var basicAuth;
var localAuth;


authHandler = (email, password, done) => {
    co(function* () {
        var isValid = yield api.userManager.isValid({email: email, password: password});

        if (isValid) {
            let user = yield api.userManager.findByEmail(email);
            return done(null, user);
        } else {
            return done();
        }

    });
};


passport.use(new BasicStrategy(authHandler));


basicAuth = passport.authenticate('basic', {session: false});


passport.use(new LocalStrategy({usernameField: 'email'}, authHandler));


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    api.userManager.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((error) => {
            done(error);
        });
});


localAuth = passport.authenticate('local');


module.exports = {
    passport,
    basicAuth,
    localAuth
};