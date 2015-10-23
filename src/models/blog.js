"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');
var formatter = require('../services/string-formatter');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-z0-9\-]*$/,
        message: 'Only lowercase letters, numbers and dash (-) are allowed for a name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [1, 50],
        message: 'A name should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var titleValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 50],
        message: 'Title should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];


var BlogSchema = new mongoose.Schema({

    "name": {
        type: String,
        required: 'A name is required.',
        validate: nameValidator,
        index: true,
        unique: true
    },

    "title": {
        type: String,
        validate: titleValidator,
        required: 'A title is required.'
    },

    "articles": [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article'
        }
    ],

    "created": {
        type: Date
    },

    "updated": {
        type: Date
    }
});


BlogSchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });


BlogSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


module.exports = mongoose.model('Blog', BlogSchema);
