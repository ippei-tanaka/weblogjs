"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');


var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'A title should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var slugValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9!@%\*\-_]*$/,
        message: 'Only alphabets, numbers and some symbols (!, @, %, *, -, _) are allowed for a slug.'
    }),
    validate({
        validator: 'isLength',
        arguments: [1, 1000],
        message: 'A slug should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var CategorySchema = new mongoose.Schema({
    "name": {
        type: String,
        validate: nameValidator,
        required: 'A name is required.'
    },

    "slug": {
        type: String,
        validate: slugValidator,
        required: 'A slug is required.',
        unique: true
    },

    "created": {
        type: Date
    },

    "updated": {
        type: Date
    }
});


CategorySchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


CategorySchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });


module.exports = mongoose.model('Category', CategorySchema);