"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');


var SettingSchema = new mongoose.Schema({
    "front": {
        type: mongoose.Schema.Types.ObjectId,
        required: 'A front blog is required.',
        ref: 'Blog'
    },

    "created": {
        type: Date
    },

    "updated": {
        type: Date
    }
});


SettingSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


SettingSchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });


module.exports = mongoose.model('Front', SettingSchema);