"use strict";


var Category = require('./models/category');
var modelManager = require('./model-manager');
var exports = modelManager.applyTo(Category);


// TODO: clean up posts when the category is deleted

exports.findBySlug = function (slug) {
    return this.findOne({slug: slug});
}.bind(exports);


module.exports = exports;