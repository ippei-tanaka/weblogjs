"use strict";

require('babel-register')({
    presets: ['es2015', 'react'],
    extensions: [".jsx", ".js"]
});

var routes = require('express').Router();
//var localAuth = require('../../passport-manager').localAuth;
var baseRoute = '/admin';
var router = require('../../pages/components/bootstraps/server').default;

/*
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
*/

routes.get(/(.+)/, (request, response) => {
    router({ location: baseRoute + request.url })
        .then(function (data) {
            var status = data.status;
            var body = data.body;
            var redirectLocation = data.redirectLocation;

            if (status === 200) {
                response.status(status).render('admin/index', { content: body });
            } else if (status === 302) {
                response.redirect(status, redirectLocation);
            } else if (status === 404) {
                response.status(status).send("Not Found!");
            }
        })
        .catch(function (error) {
            response.status(500).send(error.message);
        });
});


/*
routes.get('/', isLoggedIn, (request, response) => {
    response.render('admin/home');
});

routes.get('/test', (request, response) => {
    response.render('admin/index',
        { bootstrap: bootstrap });
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
*/

module.exports = {
    routes,
    baseRoute
};

