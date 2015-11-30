"use strict";


var routes = require('express').Router();
var url = require('url');
var baseRoute = '/';
var co = require('co');
var helpers = require('../helpers');
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
    var url = baseRoute;

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


class BlogFinder {

    constructor(blogSlug) {
        this._blogSlug = blogSlug;
        this._blog = null;
        this._setting = null;
        this._defaultBlog = null;
    }

    get blogSlug () {
        return co(function* () {
            return this._blogSlug;
        }.bind(this));
    }

    get blog () {
        return co(function* () {
            yield this._initialize();
            return this._blog || this._defaultBlog;
        }.bind(this));
    }

    isDefaultSlug () {
        return co(function* () {

            if (!this._blogSlug) {
                return null;
            }

            yield this._initialize();

            return String(this._defaultBlog._id) === String(this._blog._id);
        }.bind(this));
    };

    _initialize () {
        return co(function* () {
            if (!this._setting) {
                this._setting = yield api.settingManager.getSetting();
                this._defaultBlog = yield api.blogManager.findById(this._setting.front);
            }
            if (this._blogSlug && !this._blog) {
                this._blog = yield api.blogManager.findBySlug(this._blogSlug);
            }
        }.bind(this));
    }
}


// Routes

routes.get(/^\/(blogs\/[^/]+\/?)?(categories\/[^/]+\/?)?(page\/[0-9]+\/?)?$/, (request, response) => {

    var blogParam = request.params[0] ? request.params[0].split('/') : [];
    var categoryParam = request.params[1] ? request.params[1].split('/') : [];
    var pageParam = request.params[2] ? request.params[2].split('/') : [];

    var blogSlug = blogParam.length >= 2 && blogParam[1] ? blogParam[1] : null;
    var categorySlug = categoryParam.length >= 2 && categoryParam[1] ? categoryParam[1] : null;
    var page = pageParam.length >= 2 && pageParam[1] ? pageParam[1] : null;

    var blogSelector = new BlogFinder(blogSlug);

    observer(function* () {

        if (yield blogSelector.isDefaultSlug()) {
            response.redirect(301, buildUrl(null, categorySlug, page));
            return;
        }


        var renderer = new Renderer(response);
        var dataBuilder = new HomeViewDataBuilder({
            page: page,
            blogSlug: yield blogSelector.blogSlug,
            blog: yield blogSelector.blog,
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

