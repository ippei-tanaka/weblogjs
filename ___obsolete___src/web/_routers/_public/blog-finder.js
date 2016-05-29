"use strict";

var co = require('co');
var api = require('../../../../app/api');
var settingManager = api.settingManager;
var blogManager = api.blogManager;

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
                this._setting = yield settingManager.getSetting();
                this._defaultBlog = yield blogManager.findById(this._setting.front_blog_id);
            }
            if (this._blogSlug && !this._blog) {
                this._blog = yield api.blogManager.findBySlug(this._blogSlug);
            }
        }.bind(this));
    }
}

module.exports = BlogFinder;

