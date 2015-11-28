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


var buildUrl = function (categorySlug, page) {
    var url = "/";

    if (categorySlug) {
        url += "categories/" + categorySlug + "/";
    }

    if (page > 1) {
        url += "page/" + page + "/";
    }

    return url;
};

class Pagination {
    constructor(args) {
        this.currentPage = args.currentPage;
        this.totalPages = Math.ceil(args.totalItems / args.itemsPerPage);
        this.urlBuilder = args.urlBuilder;
    }

    get nextPage () {
        return this.currentPage + 1 <= this.totalPages ? this.currentPage + 1 : null;
    }

    get prevPage () {
        return 0 <= this.currentPage - 1 ? this.currentPage - 1 : null;
    }

    get nextPageUrl () {
        return this.nextPage ? this.urlBuilder(this.nextPage) : null;
    }

    get prevPageUrl () {
        return this.prevPage ? this.urlBuilder(this.prevPage) : null;
    }

    get needPagination () {
        return this.totalPages > 1;
    }
}

var buildViewData = function (options) {
    var defaultOptions = {
        page : 1,
        categorySlug: null
    };

    options = Object.assign({}, defaultOptions, options);

    options.page = Number.parseInt(options.page);
    options.page = !isNaN(options.page) ? options.page : 1;

    return co(function* () {
        var setting = yield settingManager.getSetting();
        var blog = yield blogManager.findById(setting.front);

        var defaultCondition = {
            blog: blog._id,
            publish_date: { $lt: new Date() }
        };

        var queryOptions = {
            sort: "publish_date,_id",
            limit: blog.posts_per_page,
            offset: (options.page - 1) * blog.posts_per_page,
            populate: ["author", "category"]
        };

        var condition = Object.assign({}, defaultCondition);

        if (options.categorySlug) {
            condition.category = yield categoryManager.findBySlug(options.categorySlug);
        }

        var pagination = new Pagination({
            totalItems: yield postManager.count(condition),
            itemsPerPage: blog.posts_per_page,
            currentPage: options.page,
            urlBuilder: buildUrl.bind(null, options.categorySlug)
        });

        return {
            blog: blog,
            postList: yield postManager.find(condition, queryOptions),
            categoryList: yield getCategoryList(defaultCondition, { name: 1 }),
            pagination: pagination
        };
    });
};


var renderViewAsResponse = function (response, options) {
    return co(function* () {
        var viewData = yield buildViewData(options);
        render.call(response, 'home', viewData);
    }).catch((error) => {
        console.error(error);
        errorHandling.call(response, 500);
    });
};


// Home
routes.get('/', (request, response) => {
    renderViewAsResponse(response);
});

routes.get('/page/:page', (request, response) => {
    renderViewAsResponse(response, {
        page: request.params.page
    });
});


// Category
routes.get('/categories/:slug', (request, response) => {
    renderViewAsResponse(response, {
        categorySlug: request.params.slug
    });
});

routes.get('/categories/:slug/page/:page', (request, response) => {
    renderViewAsResponse(response, {
        page: request.params.page,
        categorySlug: request.params.slug
    });
});


routes.get("/*", (request, response) => {
    errorHandling.call(response, 400);
});


module.exports = {
    routes,
    baseRoute
};

