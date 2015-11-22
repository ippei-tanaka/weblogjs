"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';


// Home

routes.get('/',  (request, response) => {
    response.render('admin/home');
    response.render('public-master', {
        head: {
            title: 'page title'
        },
        content: {
            title: 'post title',
            description: 'description'
        }
    });
});



module.exports = {
    routes,
    baseRoute
};

