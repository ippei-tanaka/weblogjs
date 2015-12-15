"use strict";

var api = require('../../../api');
var postManager = api.postManager;
var Pagination = require('./pagination');
var co = require('co');
var moment = require('moment');


class PostListDataBuilder {

    constructor(args) {
        this._currentPage = args.currentPage;
        this._blog = args.blog;
        this._category = args.category;
        this._author = args.author;
        this._tag = args.tag;
        this._post = args.post;
        this._publish_date = args.publishDate;
        this._paginationUrlBuilder = args.paginationUrlBuilder;
        this._postUrlBuilder = args.postUrlBuilder;
        this._tagUrlBuilder = args.tagUrlBuilder;
        this._categoryUrlBuilder = args.categoryUrlBuilder;
        this._authorUrlBuilder = args.authorUrlBuilder;
    }

    buildCondition () {
        var condition = {
            blog: this._blog._id,
            is_draft: false,
            publish_date: {$lt: this._publish_date}
        };

        if (this._category) {
            condition.category = this._category._id;
        }

        if (this._tag) {
            condition.tags = this._tag;
        }

        if (this._author) {
            condition.author = this._author._id;
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

                let extraProperties = {
                    postLink: this._postUrlBuilder(post.slug),

                    tags: post.tags.map(tag => {
                        return {
                            name: tag,
                            link: this._tagUrlBuilder(tag)
                        };
                    }),

                    category: post.category ? {
                        name: post.category.name,
                        link: this._categoryUrlBuilder(post.category.slug)
                    } : {},

                    author: post.author ? {
                        display_name: post.author.display_name,
                        link: this._authorUrlBuilder(post.author.slug)
                    } : {}
                };

                postList.push(Object.assign({}, post.toObject(), extraProperties));
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

