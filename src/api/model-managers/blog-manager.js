"use strict";


var Blog = require('./models/blog');
var modelManager = require('./model-manager');
var exports = modelManager.applyTo(Blog);


exports.findBySlug = function (slug) {
    return this.findOne({slug: slug});
}.bind(exports);


module.exports = exports;