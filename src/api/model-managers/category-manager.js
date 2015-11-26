"use strict";


var Category = require('./models/category');
var modelManager = require('./model-manager');
var ___modelManager = require('./_model-manager');
var errors = require('../errors/index');
var exports = ___modelManager.applyTo(Category);


exports.findOneBySlug = function (slug) {
    return this.findOne({slug: slug});
}.bind(exports);

module.exports = exports;