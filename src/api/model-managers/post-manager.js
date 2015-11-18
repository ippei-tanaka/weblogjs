"use strict";


var categoryManager = require('./category-manager');
var modelManager = require('./model-manager');
var Post = require('./models/post');
var errors = require('../errors/index');

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
var getList = modelManager.getList.bind({}, Post, null);


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
 * @param postInfo
 * @param workerFunction
 * @returns {Promise}
 */
var createOrUpdate = (postInfo, workerFunction) => new Promise((resolve, reject) => {

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
            workerFunction({
                title: postInfo.title,
                content: postInfo.content,
                author: postInfo.author,
                category: category ? category.id : undefined,
                slug: postInfo.slug,
                publish_date: new Date(postInfo.publish_date),
                tags: postInfo.tags
            })
                .then((post) => {
                    findById(post.id)
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        })
        .catch(reject);
});


module.exports = {
    create,
    getList,
    findById,
    updateById,
    removeById
};