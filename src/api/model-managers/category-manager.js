"use strict";


var Category = require('./models/category');
var modelManager = require('./model-manager');
var ___modelManager = require('./_model-manager');
var errors = require('../errors/index');
var exports = ___modelManager.applyTo(Category);


var create = exports.create;


var getList = exports.getList;

/**
 * @param {string} id
 * @returns {Promise}
 */
var findById = modelManager.findById.bind({}, Category, null);


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