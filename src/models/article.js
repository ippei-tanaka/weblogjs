"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var titleValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'A title should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var contentValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 10000],
        message: 'Content should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var ArticleSchema = new mongoose.Schema({
    "title": {
        type: String,
        validate: titleValidator,
        required: 'A title is required.'
    },

    "content": {
        type: String,
        required: 'Content is required.',
        validate: contentValidator
    },

    "author": {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    "publish-date": {
        type: Date
    },

    "created": {
        type: Date
    },

    "updated": {
        type: Date
    }
});


ArticleSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


module.exports = mongoose.model('Article', ArticleSchema);