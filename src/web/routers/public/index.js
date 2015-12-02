"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var co = require('co');
var Renderer = require('./renderer');
var HomeViewDataBuilder = require('./home-view-data-builder');
var BlogFinder = require('./blog-finder');
var BlogInfoDataBuilder = require('./blog-info-data-builder');
var errors = require('../../../api/errors');

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

var buildUrl = function (blogSlug, categorySlug, page) {
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

    return url;
};

// Routes

routes.get(/^\/(blog\/[^/]+\/?)?(category\/[^/]+\/?)?(page\/[0-9]+\/?)?$/, (request, response) => {

    var blogParam = request.params[0] ? request.params[0].split('/') : [];
    var categoryParam = request.params[1] ? request.params[1].split('/') : [];
    var pageParam = request.params[2] ? request.params[2].split('/') : [];

    var blogSlug = blogParam.length >= 2 && blogParam[1] ? blogParam[1] : null;
    var categorySlug = categoryParam.length >= 2 && categoryParam[1] ? categoryParam[1] : null;
    var page = pageParam.length >= 2 && pageParam[1] ? pageParam[1] : 1;

    var blogSelector = new BlogFinder(blogSlug);

    observer(function* () {

        if (yield blogSelector.isDefaultSlug()) {
            response.redirect(301, buildUrl(null, categorySlug, page));
            return;
        }


        var renderer = new Renderer(response);
        var dataBuilder = new HomeViewDataBuilder({
            page: page,
            blog: yield blogSelector.blog,
            blogSlug: yield blogSelector.blogSlug,
            categorySlug: categorySlug,
            publishDate: new Date(),
            paginationUrlBuilder: buildUrl.bind(null, blogSlug, categorySlug),
            categoryUrlBuilder: buildUrl.bind(null, blogSlug),
            blogUrlBuilder: buildUrl.bind(null)
        });
        var data = yield dataBuilder.build();

        if (!data.pagination.isCurrentPageValid) {
            throw new errors.WeblogJs404Error();
        }

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

