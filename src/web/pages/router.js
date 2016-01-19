"use strict";


var routes = require('express').Router();
var baseRoute = '/';
var router = require('./components/router/server').default;
var co = require("co");


routes.get('*', (request, response) => {

    // If you want to check if the user is authenticated:
    // request.isAuthenticated()

    var location = baseRoute + request.url;

    co(function* () {
        var ret = yield router({location});
        var status = ret.status;
        var data = ret.data;

        if (status === 200) {
            response.status(status).send(data);
        } else if (status === 302) {
            response.redirect(status, data);
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

