"use strict";

var api = require('../../../api');
var postManager = api.postManager;
var categoryManager = api.categoryManager;
var co = require('co');

class CategoryListDataBuilder {
    constructor(args) {
        this._blogId = args.blogId;
        this._publish_date = args.publishDate;
        this._urlBuilder = args.urlBuilder;
    }

    build() {
        return co(function* () {
            var condition = {
                blog: this._blogId,
                publish_date: {$lt: this._publish_date}
            };
            var sort = {name: 1};
            var postCountsByCat = yield postManager.countByCategories(condition, sort);
            var allCategories = yield categoryManager.find();

            return postCountsByCat.map((postCategory) => {
                var category = allCategories.find((cat) => String(cat._id) === String(postCategory._id));
                return {
                    name: category.name,
                    link: this._urlBuilder(category.slug),
                    count: postCategory.count
                };
            });
        }.bind(this))
    }
}


module.exports = CategoryListDataBuilder;

