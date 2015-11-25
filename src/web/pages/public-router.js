"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var api = require('../../api');
var co = require('co');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;


var render = function (view, data, status) {
    var defaultData = {
        homeUrl: "/"
    };

    data = Object.assign(defaultData, data);

    status = status || 200;

    this.status(status).render(`public/${view}`, data);
};


var errorHandling = function (status) {
    if (status === 400) {
        render.call(this, 'error', {message: "The page that you're looking for doesn't exist."}, status);
    } else {
        render.call(this, 'error', {message: "Errors have occurred."}, status);
    }
};

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
        render.call(response, 'home', {
            postList: value.posts.items,
            categoryList: categoryList
        });
    }).catch(() => {
        errorHandling.call(response, 500);
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
        render.call(response, 'home', {
            postList: value.posts.items,
            categoryList: categoryList
        });
    }).catch(() => {
        errorHandling.call(response, 500);
    });
});

routes.get("/*", (request, response) => {
    errorHandling.call(response, 400);
});


module.exports = {
    routes,
    baseRoute
};

