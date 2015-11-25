"use strict";


var categoryManager = require('./category-manager');
var userManager = require('./user-manager');
var modelManager = require('./model-manager');
var Post = require('./models/post');
var errors = require('../errors/index');
var co = require('co');

// Regular expression that checks for hex value
var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

/**
 * @param {object} postInfo - Information about the post.
 * @param {string} postInfo.title - The title of the post.
 * @param {string} postInfo.content - The content of the post.
 * @param {string} postInfo.author - The author ID of the post.
 * @param {string} postInfo.publish_date - The publish date of the post.
 * @param {string} [postInfo.category] - The category slug or ID of the post.
 * @param {string} [postInfo.slug] - The slug of the post.
 * @param {[string]} [postInfo.tags] - The tags of the post.
 * @returns {Promise}
 */

var create = (postInfo) => {
    return createOrUpdate(
        postInfo,
        modelManager.create.bind({}, Post)
    );
};


/**
 * @returns {Promise}
 */
var getList = modelManager.getList.bind({}, Post, ['author', 'category']);


/**
 * @param {string} id
 * @param {object} postInfo - Information about the post.
 * @param {string} postInfo.title - The title of the post.
 * @param {string} postInfo.content - The content of the post.
 * @param {string} postInfo.author - The author ID of the post.
 * @param {string} postInfo.publish_date - The publish date of the post.
 * @param {string} [postInfo.category] - The category slug or ID of the post.
 * @param {string} [postInfo.slug] - The slug of the post.
 * @param {[string]} [postInfo.tags] - The tags of the post.
 * @returns {Promise}
 */
var updateById = (id, postInfo) => {
    return createOrUpdate(
        postInfo,
        modelManager.updateById.bind({}, Post, id)
    );
};


/**
 * @param {string} id
 * @returns {Promise}
 */
var findById = (id) => {
    return modelManager.findById(Post, ["category", "author"], id);
};


/**
 * @param {string} id
 * @returns {Promise}
 */
var removeById = modelManager.removeById.bind({}, Post);


/**
 * @param {object} postInfo
 * @param {Function} createOrUpdate
 * @returns {Promise}
 */
var createOrUpdate = (postInfo, createOrUpdate) => new Promise((resolve, reject) => {

    var categoryValue = String(postInfo.category),
        authorValue = String(postInfo.author),
        category = null,
        author = null,
        post;

    co(function* () {
        if (checkForHexRegExp.test(categoryValue)) {
            category = yield categoryManager.findById(categoryValue);
        } else if (postInfo.category) {
            category = yield categoryManager.findBySlug(categoryValue);
        }

        if (checkForHexRegExp.test(authorValue)) {
            author = yield userManager.findById(authorValue);
        }

        post = yield createOrUpdate({
            title: postInfo.title,
            content: postInfo.content,
            author: author ? author.id : undefined,
            category: category ? category.id : undefined,
            slug: postInfo.slug,
            publish_date: new Date(postInfo.publish_date),
            tags: postInfo.tags
        });

        resolve(yield findById(post.id));

    }).catch(reject);
});


var countByCategories = () => new Promise((resolve, reject) => {

    co(function* () {
        var posts = yield Post.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]).exec();

        resolve(posts);
    }).catch(reject);

});


module.exports = {
    create,
    getList,
    findById,
    updateById,
    removeById,
    countByCategories
};