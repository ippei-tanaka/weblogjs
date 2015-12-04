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
        message: 'Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a password.'
    }),
    validate({
        validator: 'isLength',
        arguments: [8, 16],
        message: 'A password should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var displayNameValidator = [
    validate({
        validator: 'matches',
        arguments: /^[a-zA-Z0-9_\-#!@%&\* ]*$/,
        message: 'Only alphabets, numbers, spaces and some symbols (_, -, #, !, @, %, &, *) are allowed for a display name.'
    }),
    validate({
        validator: 'isLength',
        arguments: [1, 20],
        message: 'A display Name should be between {ARGS[0]} and {ARGS[1]} characters.'
    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'It is not a valid email address.'
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

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        validate: emailValidator,
        required: 'An email is required.',
        index: true,
        unique: true
    },

    password: {
        type: String,
        required: 'A password is required.',
        validate: passwordValidator,
        select: false
    },

    display_name: {
        type: String,
        required: 'A display name is required.',
        validate: displayNameValidator
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
}, {
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