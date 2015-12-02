"use strict";


var co = require('co');
var api = require('../../../api');
var categoryManager = api.categoryManager;

var BlogInfoDataBuilder = require('./blog-info-data-builder');
var CategoryListDataBuilder = require('./category-list-data-builder');
var PostListDataBuilder = require('./post-list-data-builder');


class ViewDataBuilder {

    constructor(args) {
        args = args || {};
        this._page = args.page;
        this._blog = args.blog;
        this._blogSlug = args.blogSlug;
        this._categorySlug = args.categorySlug;
        this._publishDate = args.publishDate;
        this._paginationUrlBuilder = args.paginationUrlBuilder;
        this._categoryUrlBuilder = args.categoryUrlBuilder;
        this._blogUrlBuilder = args.blogUrlBuilder;
    }

    build() {
        return co(function* () {
            var postListBuilder = new PostListDataBuilder({
                currentPage: this._page,
                blog: this._blog,
                category: yield categoryManager.findBySlug(this._categorySlug),
                publishDate: this._publishDate,
                paginationUrlBuilder: this._paginationUrlBuilder
            });

            var categoryListDataBuilder = new CategoryListDataBuilder({
                blogId: this._blog._id,
                publishDate: this._publishDate,
                urlBuilder: this._categoryUrlBuilder
            });

            var blogInfoDataBuilder = new BlogInfoDataBuilder({
                title: this._blog.title,
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

