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
        //this._uncategorizedLabel = args.uncategorizedLabel;
        //this._uncategorizedSlug = args.uncategorizedSlug;
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
            var list = [];
            //var uncategorizedCount = 0;

            for (let postCount of postCountsByCat) {
                let category = allCategories.find((cat) => String(cat._id) === String(postCount._id));

                if (category) {
                    list.push({
                        name: category.name,
                        link: this._urlBuilder(category.slug),
                        count: postCount.count
                    });
                }/* else {
                    uncategorizedCount++;
                }
                */
            }

            /*
            list.push({
                name: this._uncategorizedLabel,
                link: this._urlBuilder(this._uncategorizedSlug),
                count: uncategorizedCount
            });
            */

            return list;

        }.bind(this))
    }
}


module.exports = CategoryListDataBuilder;

