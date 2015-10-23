"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');

var titleValidator = [
    /*
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9#!@%&\*]*$/,
        message: 'Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for Password.'
    }),
    */
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'Title should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var contentValidator = [
    /*
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9_\-#!@%&\* ]*$/,
        message: 'Only alphabets, numbers, spaces and some symbols (_, -, #, !, @, %, &, *) are allowed for Display Name.'
    }),
    */
    validate({
        validator: 'isLength',
        arguments: [1, 10000],
        message: 'Body should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var ArticleSchema = new mongoose.Schema({
    "title": {
        type: String,
        validate: titleValidator,
        required: 'Title is required.'
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


// Hook for updated and created dates
ArticleSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


module.exports = mongoose.model('Article', ArticleSchema);