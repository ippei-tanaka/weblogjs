"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');


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
        arguments: [1, 1000],
        message: 'Content should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var slugValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'A slug should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var tagValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 50],
        message: 'A tag should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var PostSchema = new mongoose.Schema({
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

    "slug": {
        type: String,
        validate: slugValidator,
        required: 'A slug is required.',
        unique: true
    },

    "author": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    "category": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    "tags": [{
        type: String,
        validate: tagValidator
    }],

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


PostSchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });


PostSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


module.exports = mongoose.model('Post', PostSchema);