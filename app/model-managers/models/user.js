import co from 'co';
import mongoose from 'mongoose';
import validate from 'mongoose-validator';
import uniqueValidatorPlugin from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import privileges from './privileges';

const SALT_WORK_FACTOR = 10;

const passwordValidator = [
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

const displayNameValidator = [
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

const emailValidator = [
    validate({
        validator: 'isEmail',
        message: 'It is not a valid email address.'
    })
];

const slugValidator = [
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

const allPrivileges = Object.keys(privileges).map((privilege) => privileges[privilege]);

/*
const allPrivilegeReversed = {};

for (let key of Object.keys(privileges)) {
    allPrivilegeReversed[privileges[key]] = key;
}
*/

const privilegeValidator = [
    validate({
        validator: 'matches',
        arguments: new RegExp(`^${allPrivileges.join("|")}$`),
        message: `Privilege should be one of the following string values, ${allPrivileges.join(", ")}.`
    })
];

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            validate: emailValidator,
            required: 'Email is required.',
            lowercase: true,
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
    });

/*
UserSchema
    .virtual('readable_privileges')
    .get(function () {
        return this.privileges.map((privilege) => allPrivilegeReversed[privilege]);
    });
*/

UserSchema.plugin(
    uniqueValidatorPlugin,
    {
        message: 'The {PATH}, "{VALUE}", has been registered.'
    });

UserSchema.methods.verifyPassword = function (password) {
    return compareHashedStrings(password, this.password);
};

const compareHashedStrings = (string1, string2) => new Promise((resolve, reject) => {
    bcrypt.compare(string1, string2, (error, isMatch) => {
        if (error) return reject(error);
        resolve(isMatch);
    });
});

// Updated Date and Created Date
UserSchema.pre('save', function (next) {
    const now = new Date();

    this.updated = now;

    if (!this.created) {
        this.created = now;
    }

    next();
});

// Password
UserSchema.virtual('old_password').set(function (newValue) {
    //console.log(12312312);
    //console.log(this);
    //this._old_password = this.password;
    //console.log(this.password);
    //console.log(newValue);
    try {
        console.log(111111);
        console.log(passwordValidator[0]);
        console.log(222222);
    } catch (error) {
        console.error(error);
    }

    return newValue;
});

UserSchema.pre('save', function (next) {

    co(function* () {

        if (!this.isModified('password')) {
            return;
        }

        if (!this.isNew) {

            if (!this.old_password) return;

            console.log(yield this.verifyPassword(this.old_password)); 

            if (!(yield this.verifyPassword(this.old_password)))
            {
                throw new Error('The old password is not correct.');
            }
        }

        this.password = yield generateHash(this.password);

    }.bind(this))
        .then(next)
        .catch((error) => {
            console.log(error);
            next(error);
        });
});

const generateHash = (str) => new Promise ((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error) return reject(error);

        bcrypt.hash(str, salt, (error, hash) => {
            if (error) return reject(error);
            resolve(hash);
        });
    });
});

module.exports = mongoose.model('User', UserSchema);