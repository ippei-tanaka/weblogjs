"use strict";


var Blog = require('./models/blog');
var modelManager = require('./model-manager');
var exports = modelManager.applyTo(Blog);


module.exports = exports;