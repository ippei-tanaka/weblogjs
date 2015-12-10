"use strict";


var co = require('co');
var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var errors = require('../../../api/errors');
var api = require('../../../api');
var categoryManager = api.categoryManager;
var postManager = api.postManager;
var Renderer = require('./renderer');
var BlogFinder = require('./blog-finder');
var BlogInfoDataBuilder = require('./blog-info-data-builder');
var CategoryListDataBuilder = require('./category-list-data-builder');
var PostListDataBuilder = require('./post-list-data-builder');

var observer = function (generator, response) {
    co(generator).catch((error) => {
        co(function* () {
            var is404 = error instanceof errors.WeblogJs404Error;
            var renderer = new Renderer(response);
            var blogInfoDataBuilder = new BlogInfoDataBuilder({
                title: is404 ? "404 Not Found" : "500 Internal Server Error",
                urlBuilder: () => "/"
            });
            renderer.viewName = "error";
            renderer.viewData = {
                blogInfo: blogInfoDataBuilder.build(),
                message: is404
                    ? "The page that you're looking for doesn't exist."
                    : "Errors have occurred." + " " + error
            };
            renderer.status = is404 ? 404 : 500;
            renderer.render();
        });
    });
};

var buildUrl = function (blogSlug, categorySlug, page, postSlug) {
    var url = baseRoute;

    if (blogSlug) {
        url += "blog/" + blogSlug + "/";
    }

    if (categorySlug) {
        url += "category/" + categorySlug + "/";
    }

    if (page > 1) {
        url += "page/" + page + "/";
    }

    if (postSlug) {
        url += "post/" + postSlug + "/";
    }

    return url;
};

var parseParam = function (str, defaultValue) {
    var arr = str ? str.split('/') : [];
    return arr.length >= 2 && arr[1] ? arr[1] : defaultValue;
};


// Routes

routes.get(/^\/(blog\/[^/]+\/?)?(category\/[^/]+\/?)?(page\/[0-9]+\/?)?(post\/[^/]+\/?)?$/, (request, response) => {

    var blogSlug = parseParam(request.params[0], null);
    var categorySlug = parseParam(request.params[1], null);
    var page = parseParam(request.params[2], 1);
    var postSlug = parseParam(request.params[3], null);

    var blogSelector = new BlogFinder(blogSlug);

    observer(function* () {

        if (yield blogSelector.isDefaultSlug()) {
            response.redirect(301, buildUrl(null, categorySlug, page));
            return;
        }

        let category = yield categoryManager.findBySlug(categorySlug);

        if (categorySlug && !category) {
            throw new errors.WeblogJs404Error();
        }

        let blog =  yield blogSelector.blog;

        let publishDate = new Date();

        let postListBuilder = new PostListDataBuilder({
            currentPage         : page,
            blog                : blog,
            category            : category,
            post                : yield postManager.findBySlug(postSlug),
            publishDate         : publishDate,
            paginationUrlBuilder: buildUrl.bind(null, blogSlug, categorySlug),
            postUrlBuilder      : buildUrl.bind(null, blogSlug, null, 0)
        });

        let pagination = yield postListBuilder.buildPagination();

        if (!pagination.isCurrentPageValid) {
            throw new errors.WeblogJs404Error();
        }

        let categoryListDataBuilder = new CategoryListDataBuilder({
            blogId              : blog._id,
            publishDate         : publishDate,
            urlBuilder          : buildUrl.bind(null, blogSlug)/*,
            uncategorizedLabel  : "Uncategorized",
            uncategorizedSlug   : "uncategorized"*/
        });

        let blogInfoDataBuilder = new BlogInfoDataBuilder({
            title               : blog.title,
            blogSlug            : blogSlug,
            urlBuilder          : buildUrl.bind(null)
        });

        let data = {
            blogInfo            : blogInfoDataBuilder.build(),
            postList            : yield postListBuilder.buildList(),
            categoryList        : yield categoryListDataBuilder.build(),
            pagination          : pagination
        };

        let renderer = new Renderer(response);
        renderer.viewName = "home";
        renderer.viewData = data;
        renderer.render();
    }, response);
});

routes.get("/*", (request, response) => {
    observer(function* () {
        throw new errors.WeblogJs404Error();
    }, response);
});

module.exports = {
    routes,
    baseRoute
};

