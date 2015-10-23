"use strict";

var db = require('./user');
var user = require('./user');
var Blog = require('../models/blog');
var errors = require('../errors');


/**
 * @param {object} credential - Credential of the user.
 * @param {string} credential.email - The email of the user.
 * @param {string} credential.password - The password of the user.
 * @param {object} blogInfo - Information for the blog.
 * @param {string} blogInfo.title - the title of the blog.
 * @param {string} [blogInfo.name] - the name of the blog.
 * @returns {Promise}
 */
var create = (credential, blogInfo) => new Promise((resolve, reject) => {
    user.isValid(credential)
        .catch(reject)
        .then(() => {
            var blog = new Blog({
                name: blogInfo.name,
                title: blogInfo.title
            });
            blog.save((err) => {
                if (err) return reject(err);
                resolve();
            });
        });
});


/**
 * @param {object} credential - Credential of the user.
 * @param {string} credential.email - The email of the user.
 * @param {string} credential.password - The password of the user.
 * @param {string} name - the name of the blog.
 * @returns {Promise}
 */
var find = (credential, name) => new Promise((resolve, reject) => {
    user.isValid(credential)
        .catch(reject)
        .then(() => {
            Blog.findOne({ "name": name }).exec((err, blog) => {
                if (err) return reject(err);
                if (!blog) return reject(new errors.WeblogJsError("couldn't find the blog."));
                resolve(blog.toJSON());
            });
        });
});


module.exports = {
    create,
    find
};