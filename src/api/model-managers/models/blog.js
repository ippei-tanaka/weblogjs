"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');

var slugValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9\-_]*$/,
        message: 'Only alphabets, numbers and some symbols (-, _) are allowed for a slug.'
    }),
    validate({
        validator: 'isLength',
        arguments: [1, 1000],
        message: 'A slug should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var titleValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'A title should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var BlogSchema = new mongoose.Schema({
    "title": {
        type: String,
        validate: titleValidator,
        required: 'A title is required.'
    },

    "slug": {
        type: String,
        validate: slugValidator,
        required: 'A slug is required.',
        unique: true
    },

    "posts_per_page": {
        type: mongoose.Schema.Types.Number,
        required: 'Posts per page is required.'
    },

    "created": {
        type: Date
    },

    "updated": {
        type: Date
    }
});


BlogSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


BlogSchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });


module.exports = mongoose.model('Blog', BlogSchema);