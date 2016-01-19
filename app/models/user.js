"use strict";

var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidatorPlugin = require('mongoose-unique-validator');
var privileges = require('./privileges');

var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9#!@%&\*]*$/,
        message: 'Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for Password.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 16],
        message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var displayNameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9_\-#!@%&\* ]*$/,
        message: 'Only alphabets, numbers, spaces and some symbols (_, -, #, !, @, %, &, *) are allowed for Display Name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [1, 20],
        message: 'Display Name should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'It is not a valid email address.'
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

var allPrivileges = Object.keys(privileges).map((privilege) => privileges[privilege]);

var allPrivilegeReversed = {};

for (let key of Object.keys(privileges)) {
    allPrivilegeReversed[privileges[key]] = key;
}

var privilegeValidator = [
    validate({
        validator: 'matches',
        arguments: new RegExp(`^${allPrivileges.join("|")}$`),
        message: `Privilege should be one of the following string values, ${allPrivileges.join(", ")}.`
    })
];

var UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            validate: emailValidator,
            required: 'Email is required.',
            index: true,
            unique: true
        },

        password: {
            type: String,
            required: 'Password is required.',
            validate: passwordValidator,
            select: false
        },

        display_name: {
            type: String,
            required: 'Display Name is required.',
            validate: displayNameValidator
        },

        slug: {
            type: String,
            required: 'Slug is required.',
            validate: slugValidator,
            unique: true
        },

        privileges: [{
            type: String,
            validate: privilegeValidator,
            required: 'Privileges are required.'
        }],

        created: {
            type: Date
        },

        updated: {
            type: Date
        }
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });


UserSchema
    .virtual('readable_privileges')
    .get(function () {
        return this.privileges.map((privilege) => allPrivilegeReversed[privilege]);
    });


UserSchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });


UserSchema.methods.verifyPassword = function (password) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    }.bind(this));
};


UserSchema.pre('save', function (next) {
    var now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});


UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


module.exports = mongoose.model('User', UserSchema);