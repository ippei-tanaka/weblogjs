"use strict";

var api = require('../../../api');
var postManager = api.postManager;
var Pagination = require('./pagination');
var co = require('co');


class PostListDataBuilder {

    constructor(args) {
        this._currentPage = args.currentPage;
        this._blog = args.blog;
        this._category = args.category;
        this._tag = args.tag;
        this._post = args.post;
        this._publish_date = args.publishDate;
        this._paginationUrlBuilder = args.paginationUrlBuilder;
        this._postUrlBuilder = args.postUrlBuilder;
    }

    buildCondition () {
        var condition = {
            blog: this._blog._id,
            publish_date: {$lt: this._publish_date}
        };

        if (this._category) {
            condition.category = this._category._id;
        }

        if (this._tag) {
            condition.tags = this._tag;
        }

        if (this._post) {
            condition._id = this._post._id;
        }

        return condition;
    }

    buildList () {
        return co(function* () {
            var queryOptions = {
                sort: {
                    publish_date : -1,
                    _id: 1
                },
                limit: this._blog.posts_per_page,
                offset: (this._currentPage - 1) * this._blog.posts_per_page,
                populate: ["author", "category"]
            };

            var posts = yield postManager.find(this.buildCondition(), queryOptions);
            var postList = [];

            for (let post of posts) {
                let linkObj = {
                    link: this._postUrlBuilder(post.slug)
                };
                postList.push(Object.assign({}, linkObj, post.toObject()));
            }

            return postList;

        }.bind(this))
    }

    buildPagination () {
        return co(function* () {
            return new Pagination({
                totalItems: yield postManager.count(this.buildCondition()),
                itemsPerPage: this._blog.posts_per_page,
                currentPage: this._currentPage,
                urlBuilder: this._paginationUrlBuilder
            });
        }.bind(this))
    }
}


module.exports = PostListDataBuilder;

