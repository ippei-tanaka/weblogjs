"use strict";

var Post = require('./models/post');
var modelManager = require('./_model-manager');
var exports = modelManager.applyTo(Post);
var errors = require('../errors/index');
var Helpers = require('./helpers');
var co = require('co');

/**
 * @typedef {Object} PostObject
 * @property {string} title - The title of the post.
 * @property {string} content - The content of the post.
 * @property {string} author - The author ID of the post.
 * @property {string} publish_date - The publish date of the post.
 * @property {string} category - The category slug or ID of the post.
 * @property {string} slug - The slug of the post.
 * @property {[string]} [tags] - The tags of the post.
 */

exports.countByCategories = function () {
    return co(function* () {
        var posts = yield Post.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]).exec();
        resolve(posts);
    });
};


module.exports = exports;