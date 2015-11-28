"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var api = require('../../api');
var co = require('co');
var userManager = api.userManager;
var categoryManager = api.categoryManager;
var postManager = api.postManager;
var blogManager = api.blogManager;
var settingManager = api.settingManager;
var helpers = require('../router-helpers');


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

var getCategoryList = (condition, sort) =>
    co(function* () {
        var postCountsByCat = yield postManager.countByCategories(condition, sort);
        var allCategories = yield categoryManager.find();
        var categoryList = [];

        for (let postCategory of postCountsByCat) {
            var category = allCategories.find((cat) => String(cat._id) === String(postCategory._id));
            categoryList.push({
                name: category.name,
                link: `/categories/${category.slug}`,
                count: postCategory.count
            });
        }

        return categoryList;
    });


var buildViewData = function (condition, queryOptions) {
    var defaultQuery = {
        sort: "publish_date,_id",
        limit: 10,
        offset: 0,
        populate: ["author", "category"]
    };
    queryOptions = Object.assign({}, defaultQuery, queryOptions);
    queryOptions = helpers.parseParams(queryOptions);

    return co(function* () {
        var setting = yield settingManager.getSetting();
        var defaultCondition = {
            blog: setting.front,
            publish_date: { $lt: new Date() }
        };

        condition = Object.assign({}, defaultCondition, condition);

        return {
            blog: yield blogManager.findById(setting.front),
            postList: yield postManager.find(condition, queryOptions),
            categoryList: yield getCategoryList(defaultCondition, { name: 1 })
        };
    });
};


// Home
routes.get('/', (request, response) => {
    var urlParts = url.parse(request.url, true);

    co(function* () {
        var viewData = yield buildViewData({}, urlParts.query);
        render.call(response, 'home', viewData);
    }).catch((error) => {
        console.error(error);
        errorHandling.call(response, 500);
    });
});


// Category
routes.get('/categories/:slug/', (request, response) => {
    var slug = request.params.slug;
    var urlParts = url.parse(request.url, true);

    co(function* () {
        var category = yield categoryManager.findBySlug(slug);
        var viewData = yield buildViewData({ category: category._id }, urlParts.query);
        render.call(response, 'home', viewData);
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

