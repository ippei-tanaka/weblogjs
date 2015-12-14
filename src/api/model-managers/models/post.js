"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');


var titleValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'Title should be between {ARGS[0]} and {ARGS[1]} characters.'
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
        validator: 'matches',
        arguments: /^[a-zA-Z0-9\-_]*$/,
        message: 'Only alphabets, numbers and some symbols (-, _) are allowed for a slug.'
    }),
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'Slug should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var tagValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 50],
        message: 'Tag should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var PostSchema = new mongoose.Schema({
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

    "slug": {
        type: String,
        validate: slugValidator,
        required: 'Slug is required.',
        unique: true
    },

    "author": {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Author is required.',
        ref: 'User'
    },

    "category": {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Category is required.',
        ref: 'Category'
    },

    "blog": {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Blog is required.',
        ref: 'Blog'
    },

    "tags": [{
        type: String,
        default: [],
        validate: tagValidator
    }],

    "publish_date": {
        type: Date,
        required: 'Publish date is required.'
    },

    "is_draft": {
        type: Boolean,
        required: '"is_draft" field is required.'
    },

    "created": {
        type: Date
    },

    "updated": {
        type: Date
    }
});


PostSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


PostSchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });


module.exports = mongoose.model('Post', PostSchema);