"use strict";

var api = require('../../../../app/api');
var postManager = api.postManager;
var co = require('co');


class TagListDataBuilder {

    constructor(args) {
        this._blogId = args.blogId;
        this._publish_date = args.publishDate;
        this._urlBuilder = args.urlBuilder;
    }

    build() {
        return co(function* () {
            var condition = {
                blog: this._blogId,
                is_draft: false,
                publish_date: {$lt: this._publish_date}
            };
            var sort = {name: 1};
            var postCountsByTag = yield postManager.countByTag(condition, sort);
            var list = [];

            for (let postCount of postCountsByTag) {
                list.push({
                    name: postCount.tag,
                    link: this._urlBuilder(postCount.tag),
                    count: postCount.count
                });
            }

            return list;

        }.bind(this))
    }
}


module.exports = TagListDataBuilder;

