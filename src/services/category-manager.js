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
 * @param {string} slug
 * @returns {Promise}
 */
var findBySlug = (slug) => new Promise((resolve, reject) => {
    Category.find({slug: slug}).exec((err, categoty) => {
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
var removeBySlug = (slug) => new Promise((resolve, reject) => {
    Category.remove({slug: slug}).exec((err) => {
        if (err) return reject(err);
        resolve();
    });
});


module.exports = {
    create,
    getList
    /*
     findById,
    isValid,
    remove
    */
};