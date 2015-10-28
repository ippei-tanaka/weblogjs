"use strict";


var Category = require('../models/category');
var modelManager = require('./model-manager');
var errors = require('../errors/index');


/**
 * @param {object} categoryInfo - Information about the category.
 * @param {string} categoryInfo.name - The name of the category.
 * @param {string} [categoryInfo.slug] - The content of the category.
 * @returns {Promise}
 */
var create = (categoryInfo) => {
    return modelManager.create(Category, {
        name: categoryInfo.name,
        slug: categoryInfo.slug
    });
};


/**
 * @param {object} [options]
 * @param {string} [options.sort] - info for sort. (e.g.) "author asc,datepublished desc"
 * @param {number} [options.limit]
 * @returns {Promise}
 */
var getList = modelManager.getList.bind({}, Category);


/**
 * @param {string} id
 * @returns {Promise}
 */
var findById = modelManager.findById.bind({}, Category);


/**
 * @param {string} slug
 * @returns {Promise}
 */
var findBySlug = (slug) => {
    return modelManager.findOneBy(Category, "slug", slug);
};


/**
 * @param {string} id
 * @param {object} newCategory
 * @param {string} [newCategory.name] - The name of the category.
 * @param {string} [newCategory.slug] - The content of the category.
 * @returns {Promise}
 */
var updateById = (id, newCategory) => {
    return modelManager.updateById(Category, id, {
        name: newCategory.name,
        slug: newCategory.slug
    });
};


/**
 * @param {string} id
 * @returns {Promise}
 */
var removeById = modelManager.removeById.bind({}, Category);


module.exports = {
    create,
    getList,
    findById,
    findBySlug,
    updateById,
    removeById
};