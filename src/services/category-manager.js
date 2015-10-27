"use strict";


var Category = require('../models/category');
var errors = require('../errors');


/**
 * @param {object} categoryInfo - Information about the category.
 * @param {string} categoryInfo.name - The name of the category.
 * @param {string} [categoryInfo.slug] - The content of the category.
 * @returns {Promise}
 */
var create = (categoryInfo) => new Promise((resolve, reject) => {
    var category = new Category({
        name: categoryInfo.name,
        slug: categoryInfo.slug
    });

    category.save((err) => {
        if (err) return reject(err);
        resolve(category.toJSON());
    });
});


/**
 * @returns {Promise}
 */
var getList = () => new Promise((resolve, reject) => {
    Category.find({}).exec((err, categories) => {
        if (err) return reject(err);
        resolve({
            categories: categories.map((_category) => _category.toJSON())
        });
    });
});


/**
 * @param {string} id
 * @returns {Promise}
 */
var findById = (id) => new Promise((resolve, reject) => {
    Category.findById(id).exec((err, categoty) => {
        if (err) return reject(err);

        if (!categoty)
            return reject(new errors.WeblogJsError("The category doesn't exist."));

        resolve(categoty);
    });
});


/**
 * @param {string} slug
 * @returns {Promise}
 */
var findBySlug = (slug) => new Promise((resolve, reject) => {
    Category.findOne({slug: slug}).exec((err, categoty) => {
        if (err) return reject(err);

        if (!categoty)
            return reject(new errors.WeblogJsError("The category doesn't exist."));

        resolve(categoty);
    });
});


/**
 * @param {string} id
 * @param {object} newCategory
 * @param {string} [newCategory.name] - The name of the category.
 * @param {string} [newCategory.slug] - The content of the category.
 * @returns {Promise}
 */
var updateById = (id, newCategory) => new Promise((resolve, reject) => {
    Category.findByIdAndUpdate(id, {$set: newCategory}).exec((err, categoty) => {
        if (err) return reject(err);

        if (!categoty)
            return reject(new errors.WeblogJsError("The category doesn't exist."));

        resolve(categoty);
    });
});


/**
 * @param {string} id
 * @returns {Promise}
 */
var removeById = (id) => new Promise((resolve, reject) => {
    Category.remove({_id: id}).exec((err) => {
        if (err) return reject(err);
        resolve();
    });
});


module.exports = {
    create,
    getList,
    findById,
    findBySlug,
    updateById,
    removeById
};