"use strict";

require('babel-register')({
    presets: ['es2015', 'react'],
    extensions: [".jsx", ".js"]
});

var routes = require('express').Router();
var baseRoute = '/';
var router = require('../../pages/components/router/server').default;
var co = require("co");


routes.get('*', (request, response) => {

    // If you want to check if the user is authenticated:
    // request.isAuthenticated()

    var location = baseRoute + request.url;

    co(function* () {
        var data = yield router({location});
        var status = data.status;
        var body = data.body;
        var redirectLocation = data.redirectLocation;

        if (status === 200) {
            response.status(status).send(body);
        } else if (status === 302) {
            response.redirect(status, redirectLocation);
        } else if (status === 404) {
            response.status(status).send("Not Found!");
        }
    }).catch(error => {
        response.status(500).send(error.message);
    });
});


module.exports = {
    routes,
    baseRoute
};

