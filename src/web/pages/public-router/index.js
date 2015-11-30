"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var co = require('co');
var helpers = require('../../router-helpers');
var Renderer = require('./renderer');
var HomeViewDataBuilder = require('./home-view-data-builder');
var api = require('../../../api');
var errors = require('../../../api/errors');


var observer = function (generator, response) {
    co(generator).catch((error) => {
        co(function* () {
            var is404 = error instanceof errors.WeblogJs404Error;
            var renderer = new Renderer(response);
            renderer.viewName = "error";
            renderer.viewData = {
                blogInfo: {
                    title: (yield api.blogManager.findById((yield api.settingManager.getSetting()).front)).title,
                    homeUri: "/"
                },
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
    var url = "/";

    if (blogSlug) {
        url += "blogs/" + blogSlug + "/";
    }

    if (categorySlug) {
        url += "categories/" + categorySlug + "/";
    }

    if (page > 1) {
        url += "page/" + page + "/";
    }

    return url;
};


// Routes

routes.get(/^\/(blogs\/[^/]+\/?)?(categories\/[^/]+\/?)?(page\/[0-9]+\/?)?$/, (request, response) => {

    var blogParam = request.params[0] ? request.params[0].split('/') : [];
    var categoryParam = request.params[1] ? request.params[1].split('/') : [];
    var pageParam = request.params[2] ? request.params[2].split('/') : [];

    var blogSlug = blogParam.length >= 2 && blogParam[1] ? blogParam[1] : null;
    var categorySlug = categoryParam.length >= 2 && categoryParam[1] ? categoryParam[1] : null;
    var page = pageParam.length >= 2 && pageParam[1] ? pageParam[1] : null;

    observer(function* () {
        var renderer = new Renderer(response);
        var dataBuilder = new HomeViewDataBuilder({
            page: page,
            blogSlug: blogSlug,
            categorySlug: categorySlug,
            publishDate: new Date(),
            paginationUrlBuilder: buildUrl.bind(null, blogSlug, categorySlug),
            categoryUrlBuilder: buildUrl.bind(null, blogSlug),
            blogUrlBuilder: buildUrl.bind(null)
        });
        var data = yield dataBuilder.build();

        if (!data.pagination.isCurrentPageInvalid) {
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

