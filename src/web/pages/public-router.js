"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var api = require('../../api');
var co = require('co');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;
var helpers = require('../helpers');


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

var getCategoryList = () =>
    co(function* () {
        var postCountsByCat = yield postManager.countByCategories();
        var allCategories = yield categoryManager.find();
        var uncategorized = 0;
        var categoryList = [];

        for (let postCategory of postCountsByCat) {
            var category = allCategories.find((cat) => String(cat._id) === String(postCategory._id));

            if (!category) {
                uncategorized += 1;
            } else {
                categoryList.push({
                    name: category.name,
                    link: `/categories/${category.slug}`,
                    count: postCategory.count
                });
            }
        }

        categoryList.push({
            name: "Uncategorized",
            link: "/categories/uncategorized",
            count: uncategorized
        });

        return categoryList;
    });

// Home
routes.get('/', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var queryOptions = urlParts.query;
    var defaultQuery = {
        sort: "publish_date,_id",
        limit: 10,
        offset: 0,
        populate: ["author", "category"]
    };
    queryOptions = Object.assign({}, defaultQuery, queryOptions);
    queryOptions = helpers.parseParams(queryOptions);


    co(function* () {
        return {
            posts: yield postManager.find({}, queryOptions),
            categoryList: yield getCategoryList()
        };
    }).then(function (value) {
        render.call(response, 'home', {
            postList: value.posts,
            categoryList: value.categoryList
        });
    }).catch((error) => {
        console.error(error);
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
    query = Object.assign({}, defaultQuery, query);
    query = helpers.parseParams(query);

    slug = slug === "uncategorized" ? null : slug;

    co(function* () {
        var category = yield categoryManager.findBySlug(slug);
        var categoryId = category ? category._id : null;
        return {
            posts: yield postManager.find({category: categoryId}, query),
            categoryList: yield getCategoryList()
        };
    }).then(function (value) {
        render.call(response, 'home', {
            postList: value.posts,
            categoryList: value.categoryList
        });
    }).catch((error) => {
        console.error(error);
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

