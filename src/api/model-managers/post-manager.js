"use strict";

var Post = require('./models/post');
var modelManager = require('./model-manager');
var exports = modelManager.applyTo(Post);


exports.findBySlug = function (slug) {
    return this.findOne({slug: slug});
}.bind(exports);


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

exports.countByCategories = (condition, sort) =>
    new Promise((resolve, reject) => {

        condition = condition || {};
        sort = sort || {};

        Post.aggregate([
            {
                $match: condition
            },
            {
                $group: {
                    _id: "$category",
                    count: {$sum: 1}
                }
            },
            {
                $sort: sort
            }
        ]).exec((err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });


module.exports = exports;