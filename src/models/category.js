"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');
var formatter = require('../services/string-formatter');


var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [1, 200],
        message: 'A title should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var slugValidator = [
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


CategorySchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slug = formatter.dasherize(this.name);
    }

    mongoose.model('Category')
        .count({slug: this.slug})
        .exec(function (err, count) {
            if (err)
                return next(err);

            if (count > 0) {
                this.slug += (count + 1);
            }
            next();
        }.bind(this));
});


module.exports = mongoose.model('Category', CategorySchema);