"use strict";


var Post = require('../models/post');
var errors = require('../errors');


/**
 * @param {object} postInfo - Information about the post.
 * @param {string} postInfo.title - The title of the post.
 * @param {string} postInfo.content - The content of the post.
 * @param {string} postInfo.author - The author ID of the post.
 * @param {string} [postInfo.category] - The category ID of the post.
 * @param {string} [postInfo.slug] - The slug of the post.
 * @param {[string]} [postInfo.tags] - The tags of the post.
 * @returns {Promise}
 */
var create = (postInfo) => new Promise((resolve, reject) => {
    var post = new Post({
        title: postInfo.title,
        content: postInfo.content,
        author: postInfo.author,
        category: postInfo.category,
        slug: postInfo.slug,
        tags: postInfo.tags
    });

    post.save((err) => {
        if (err) return reject(err);
        resolve(post.toJSON());
    });
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


/**
 * @param {object} credential - Credential of the user.
 * @param {string} credential.email - The email of the user.
 * @param {string} credential.password - The password of the user.
 * @returns {Promise}
 */
    /*
var isValid = (credential) =>  new Promise((resolve, reject) => {
    User
        .findOne({"email": credential.email})
        .select('password')
        .exec((err, user) => {

            if (err)
                return reject(err);

            if (!user)
                return reject(new errors.WeblogJsError("The email hasn't been registered or the password is incorrect."));

            user.verifyPassword(credential.password, (err, isMatch) => {
                if (err && !isMatch)
                    return reject(new errors.WeblogJsError("The email hasn't been registered or the password is incorrect."));

                resolve(user.toJSON());
            });
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