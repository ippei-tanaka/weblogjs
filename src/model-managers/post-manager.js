"use strict";


var categoryManager = require('./category-manager');
var Post = require('../models/post');
var errors = require('../errors/index');

// Regular expression that checks for hex value
var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

/**
 * @param {object} postInfo - Information about the post.
 * @param {string} postInfo.title - The title of the post.
 * @param {string} postInfo.content - The content of the post.
 * @param {string} postInfo.author - The author ID of the post.
 * @param {string} [postInfo.category] - The category slug or ID of the post.
 * @param {string} [postInfo.slug] - The slug of the post.
 * @param {[string]} [postInfo.tags] - The tags of the post.
 * @returns {Promise}
 */
var create = (postInfo) => new Promise((resolve, reject) => {

    var promise,
        categoryValue = String(postInfo.category);

    if (!postInfo.category) {
        promise = Promise.resolve(null);
    } else if (checkForHexRegExp.test(categoryValue)) {
        promise = categoryManager.findById(categoryValue);
    } else {
        promise = categoryManager.findBySlug(categoryValue);
    }

    promise
        .then((category) => {
            var post = new Post({
                title: postInfo.title,
                content: postInfo.content,
                author: postInfo.author,
                category: category ? category.id : undefined,
                slug: postInfo.slug,
                tags: postInfo.tags
            });

            post.save((err) => {
                if (err) return reject(err);
                resolve(post.toJSON());
            });
        })
        .catch(reject);

});


/**
 * @returns {Promise}
 */
    /*
var getList = () => new Promise((resolve, reject) => {
    User.find({}).exec((err, users) => {
        if (err) return reject(err);
        resolve({
            users: users.map((_user) => _user.toJSON())
        });
    });
});
*/


/**
 * @param {string} id - a user id
 * @returns {Promise}
 */
    /*
var findById = (id) => new Promise((resolve, reject) => {
    User.findById(id).exec((err, user) => {
        if (err) return reject(err);

        if (!user)
            return reject(new errors.WeblogJsError("The user doesn't exist."));

        resolve(user);
    });
});
*/


/**
 * @param {string} id - a user id
 * @returns {Promise}
 */
    /*
var remove = (id) => new Promise((resolve, reject) => {
    User.remove({_id: id}).exec((err) => {
        if (err) return reject(err);
        resolve();
    });
});
*/

module.exports = {
    create,
    /*
    getList,
    findById,
    isValid,
    remove
    */
};