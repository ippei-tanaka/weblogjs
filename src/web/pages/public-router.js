"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var api = require('../../api');
var co = require('co');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;


// Home
routes.get('/', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var query = urlParts.query;
    var defaultQuery = {
        sort: "publish_date asc,_id asc",
        limit: 10,
        offset: 0
    };
    query = Object.assign(defaultQuery, query);

    co(function* () {
        return {
            posts: yield postManager.getList(query),
            categories: yield categoryManager.getList()
        };
    }).then(function (value) {
        var categoryList = value.categories.items.map(function (category) {
            return {
                name: category.name,
                link: `/categories/${category.slug}`
            };
        });
        response.render('public/home', {
            postList: value.posts.items,
            categoryList: categoryList
        });
    }).catch(() => {
        response.status(500).send('Problems have occurred.');
    });
});


// Category
routes.get('/categories/:slug/', (request, response) => {
    var slug = request.params.slug;
    var urlParts = url.parse(request.url, true);
    var query = urlParts.query;
    var defaultQuery = {
        sort: "publish_date asc,_id asc",
        limit: 20,
        offset: 0
    };
    query = Object.assign(defaultQuery, query);

    co(function* () {
        var category = yield categoryManager.findBySlug(slug);

        console.log(category);

        return {
            posts: yield postManager.getList(query, {category: category._id}),
            categories: yield categoryManager.getList()
        };
    }).then(function (value) {
        var categoryList = value.categories.items.map(function (category) {
            return {
                name: category.name,
                link: `/categories/${category.slug}`
            };
        });
        response.render('public/home', {
            postList: value.posts.items,
            categoryList: categoryList
        });
    }).catch(() => {
        response.status(500).send('Problems have occurred.');
    });
});


module.exports = {
    routes,
    baseRoute
};

