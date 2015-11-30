"use strict";


var Category = require('./models/category');
var modelManager = require('./model-manager');
var exports = modelManager.applyTo(Category);


exports.findBySlug = function (slug) {
    return this.findOne({slug: slug});
}.bind(exports);


module.exports = exports;