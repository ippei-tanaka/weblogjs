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
        this._publish_date = args.publishDate;
        this._paginationUrlBuilder = args.paginationUrlBuilder;
    }

    buildCondition () {
        var condition = {
            blog: this._blog._id,
            publish_date: {$lt: this._publish_date}
        };

        if (this._category) {
            condition.category = this._category._id;
        }

        return condition;
    }

    buildList () {
        return co(function* () {
            var queryOptions = {
                sort: {publish_date : -1, _id: 1},
                limit: this._blog.posts_per_page,
                offset: (this._currentPage - 1) * this._blog.posts_per_page,
                populate: ["author", "category"]
            };

            return yield postManager.find(this.buildCondition(), queryOptions);
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

