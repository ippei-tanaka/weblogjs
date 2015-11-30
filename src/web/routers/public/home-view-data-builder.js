"use strict";


var co = require('co');
var api = require('../../../api');
var categoryManager = api.categoryManager;
var blogManager = api.blogManager;
var settingManager = api.settingManager;

var BlogInfoDataBuilder = require('./blog-info-data-builder');
var CategoryListDataBuilder = require('./category-list-data-builder');
var PostListDataBuilder = require('./post-list-data-builder');


class ViewDataBuilder {

    constructor(args) {
        args = args || {};
        this._page = args.page || 1;
        this._blogSlug = args.blogSlug || null;
        this._categorySlug = args.categorySlug || null;
        this._publishDate = args.publishDate;
        this._paginationUrlBuilder = args.paginationUrlBuilder;
        this._categoryUrlBuilder = args.categoryUrlBuilder;
        this._blogUrlBuilder = args.blogUrlBuilder;
    }

    findBlog (blogSlug) {
        return co(function* () {
            var blog;
            if (blogSlug) {
                blog = yield blogManager.findBySlug(blogSlug);
            } else {
                let setting = yield settingManager.getSetting();
                blog = yield blogManager.findById(setting.front);
            }
            return blog;
        });
    }

    build() {
        return co(function* () {
            var blog = yield this.findBlog(this._blogSlug);

            var postListBuilder = new PostListDataBuilder({
                currentPage: this._page,
                blog: blog,
                category: yield categoryManager.findBySlug(this._categorySlug),
                publishDate: this._publishDate,
                paginationUrlBuilder: this._paginationUrlBuilder
            });

            var categoryListDataBuilder = new CategoryListDataBuilder({
                blogId: blog._id,
                publishDate: this._publishDate,
                urlBuilder: this._categoryUrlBuilder
            });

            var blogInfoDataBuilder = new BlogInfoDataBuilder({
                title: blog.title,
                blogSlug: this._blogSlug,
                urlBuilder: this._blogUrlBuilder
            });

            return {
                blogInfo: blogInfoDataBuilder.build(),
                postList: yield postListBuilder.buildList(),
                categoryList: yield categoryListDataBuilder.build(),
                pagination: yield postListBuilder.buildPagination()
            };
        }.bind(this));
    }

}


module.exports = ViewDataBuilder;

