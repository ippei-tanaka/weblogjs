import validator from 'validator';
import Schema from './lib/schema';
import co from 'co';
import deepcopy from 'deepcopy';
import bcrypt from 'bcrypt';
import Types from './lib/types';

const paths = {

    email: {
        unique: true,
        required: true,
        type: Types.String,
        sanitize: (value) => validator.normalizeEmail(value),
        validate: function* (value) {
            if (!validator.isEmail(value)) {
                yield `A ${this.name} should be a valid email.`;
            }
        }
    },

    password: {
        required: true,
        type: Types.String,
        validate: function* (value) {
            const range = {min: 8, max: 16};
            if (!validator.isLength(value, range)) {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9#!@%&\*]*$/)) {
                yield `Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a ${this.name}.`;
            }
        }
    },

    display_name: {
        display_name: "display name",
        required: true,
        type: Types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value) {
            const range = {min: 1, max: 20};
            if (!validator.isLength(value, range)) {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9_\-#!@%&\* ]*$/)) {
                yield `Only alphabets, numbers, spaces and some symbols (_, -, #, !, @, %, &, *) are allowed for a ${this.name}.`;
            }
        }
    },

    slug: {
        unique: true,
        required: true,
        type: Types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value) {
            const range = {min: 1, max: 200};
            if (!validator.isLength(value, range)) {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }

            if (!validator.matches(value, /^[a-zA-Z0-9\-_]*$/)) {
                yield `Only alphabets, numbers and some symbols (-, _) are allowed for a ${this.name}.`;
            }
        }
    }
};

const SALT_WORK_FACTOR = 10;

const generateHash = (str) => new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error) return reject(error);

        bcrypt.hash(str, salt, (error, hash) => {
            if (error) return reject(error);
            resolve(hash);
        });
    });
});

const compareHashedStrings = (plainString, hashedString) => new Promise((resolve, reject) => {
    bcrypt.compare(plainString, hashedString, (error, isMatch) => {
        if (error) return reject(error);
        resolve(isMatch);
    });
});

const HASHED_PASSWORD = "hashed_password";
const OLD_PASSWORD = "old_password";
const PASSWORD_UPDATE = "password_update";
const PASSWORD = "password";
const PASSWORD_CONFIRMED = "password_confirmed";

class UserSchema extends Schema {

    /**
     * @override
     */
    constructor() {
        super('user', paths);
    }

    /**
     * @override
     */
    get projection() {
        return Object.assign(
            {},
            super.projection,
            {
                password: false
            });
    }

    compareHashedStrings(plainString, hashedString) {
        return compareHashedStrings(plainString, hashedString);
    }

    _preCreate(doc, rowDoc) {
        const superFunc = super._preCreate.bind(this);

        return co(function* () {
            const _doc = deepcopy(yield superFunc(doc, rowDoc));
            _doc[HASHED_PASSWORD] = yield generateHash(rowDoc[PASSWORD]);
            _doc[PASSWORD] = rowDoc[PASSWORD];
            return _doc;
        });
    }

    _preUpdate(doc, rowDoc, oldDoc, newValues) {
        const superFunc = super._preUpdate.bind(this);

        return co(function* () {
            const _doc = deepcopy(yield superFunc(doc, rowDoc, oldDoc, newValues));
            const errors = {};

            if (newValues[PASSWORD_UPDATE]) {
                if (!newValues.hasOwnProperty(PASSWORD) || !newValues[PASSWORD]) {
                    errors[PASSWORD] = ["A new password is required."];
                }

                if (!newValues.hasOwnProperty(OLD_PASSWORD) || !newValues[OLD_PASSWORD]) {
                    errors[OLD_PASSWORD] = ["The current password is required."];
                }

                if (!newValues.hasOwnProperty(PASSWORD_CONFIRMED) || !newValues[PASSWORD_CONFIRMED]) {
                    errors[PASSWORD_CONFIRMED] = ["The confirmed password is required."];
                }

                if (newValues.hasOwnProperty(PASSWORD_CONFIRMED)
                    && newValues[PASSWORD_CONFIRMED] !== ""
                    && newValues[PASSWORD] !== newValues[PASSWORD_CONFIRMED]) {
                    errors[PASSWORD_CONFIRMED] = ['The confirmed password sent is not the same as the new password.'];
                }

                if (newValues.hasOwnProperty(OLD_PASSWORD) && newValues[OLD_PASSWORD] !== "") {
                    const result = yield this.compareHashedStrings(newValues[OLD_PASSWORD], oldDoc[HASHED_PASSWORD]);
                    if (!result) {
                        errors[OLD_PASSWORD] = ["The current password sent is not correct."];
                    }
                }

                if (Object.keys(errors).length === 0) {
                    _doc[HASHED_PASSWORD] = yield generateHash(newValues[PASSWORD]);
                }
            } else {
                if (newValues.hasOwnProperty(PASSWORD)) {
                    errors[PASSWORD] = ["The password can't be updated."];
                }
            }

            if (Object.keys(errors).length > 0) {
                throw errors;
            }

            return _doc;
        }.bind(this));
    }

}

export default new UserSchema();