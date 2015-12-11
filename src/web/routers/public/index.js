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
var TagListDataBuilder = require('./tag-list-data-builder');


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


var buildUrl = function (options) {
    var url = baseRoute;

    options = options || {};

    if (options.blogSlug) {
        url += "blog/" + options.blogSlug + "/";
    }

    if (options.categorySlug) {
        url += "category/" + options.categorySlug + "/";
    }

    if (options.tag) {
        url += "tag/" + options.tag + "/";
    }

    if (options.page > 1) {
        url += "page/" + options.page + "/";
    }

    if (options.postSlug) {
        url += "post/" + options.postSlug + "/";
    }

    return url;
};


var parseParam = function (str, defaultValue) {
    var arr = str ? str.split('/') : [];
    return arr.length >= 2 && arr[1] ? arr[1] : defaultValue;
};


// Routes

routes.get(/^\/(blog\/[^/]+\/?)?(category\/[^/]+\/?)?(tag\/[^/]+\/?)?(page\/[0-9]+\/?)?(post\/[^/]+\/?)?$/, (request, response) => {

    var blogSlug = parseParam(request.params[0], null);
    var categorySlug = parseParam(request.params[1], null);
    var tag = parseParam(request.params[2], null);
    var page = parseParam(request.params[3], 1);
    var postSlug = parseParam(request.params[4], null);

    var blogSelector = new BlogFinder(blogSlug);

    observer(function* () {

        if (yield blogSelector.isDefaultSlug()) {
            response.redirect(301, buildUrl({categorySlug, page}));
            return;
        }

        let category = yield categoryManager.findBySlug(categorySlug);

        if (categorySlug && !category) {
            throw new errors.WeblogJs404Error();
        }

        let post = yield postManager.findBySlug(postSlug);

        if (postSlug && !post) {
            throw new errors.WeblogJs404Error();
        }

        let blog =  yield blogSelector.blog;

        let publishDate = new Date();

        let postListBuilder = new PostListDataBuilder({
            currentPage         : page,
            blog                : blog,
            category            : category,
            tag                 : tag,
            post                : post,
            publishDate         : publishDate,
            paginationUrlBuilder: (_page) => buildUrl({blogSlug, categorySlug, tag, page: _page}),
            postUrlBuilder      : (_postSlug) => buildUrl({blogSlug, postSlug:_postSlug}),
            tagUrlBuilder       : (_tag) => buildUrl({blogSlug, tag: _tag}),
            categoryUrlBuilder  : (_categorySlug) => buildUrl({blogSlug, categorySlug: _categorySlug})
        });

        let pagination = yield postListBuilder.buildPagination();

        if (!pagination.isCurrentPageValid) {
            throw new errors.WeblogJs404Error();
        }

        let categoryListDataBuilder = new CategoryListDataBuilder({
            blogId              : blog._id,
            publishDate         : publishDate,
            urlBuilder          : (_categorySlug) => buildUrl({blogSlug, categorySlug: _categorySlug})
        });

        let tagListDataBuilder = new TagListDataBuilder({
            blogId              : blog._id,
            publishDate         : publishDate,
            urlBuilder          : (_tag) => buildUrl({blogSlug, tag: _tag})
        });

        let blogInfoDataBuilder = new BlogInfoDataBuilder({
            title               : blog.title,
            blogSlug            : blogSlug,
            urlBuilder          : (_blogSlug) => buildUrl({blogSlug: _blogSlug})
        });

        let data = {
            blogInfo            : blogInfoDataBuilder.build(),
            postList            : yield postListBuilder.buildList(),
            categoryList        : yield categoryListDataBuilder.build(),
            tagList             : yield tagListDataBuilder.build(),
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

