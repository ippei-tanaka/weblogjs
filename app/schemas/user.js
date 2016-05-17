import validator from 'validator';
import Schema from './lib/schema';
import co from 'co';
import deepcopy from 'deepcopy';
import bcrypt from 'bcrypt';
import Path from './lib/path';

const paths = {

    email: {
        unique: true,
        required: true,
        type: Path.Types.String,
        sanitize: (value) => validator.normalizeEmail(value),
        validate: function* (value) {
            if (!validator.isEmail(value)) {
                yield `A ${this.name} should be a valid email.`;
            }
        }
    },

    password: {
        required: true,
        type: Path.Types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value) {
            const range = {min:8, max: 16};
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
        type: Path.Types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value) {
            const range = {min:1, max: 20};
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
        type: Path.Types.String,
        sanitize: (value) => value.trim(),
        validate: function* (value) {
            const range = {min:1, max: 200};
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

const generateHash = (str) => new Promise ((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
        if (error) return reject(error);

        bcrypt.hash(str, salt, (error, hash) => {
            if (error) return reject(error);
            resolve(hash);
        });
    });
});

const compareHashedStrings = (string1, string2) => new Promise((resolve, reject) => {
    bcrypt.compare(string1, string2, (error, isMatch) => {
        if (error) return reject(error);
        resolve(isMatch);
    });
});

const HASHED_PASSWORD = "hashed_password";
const OLD_PASSWORD = "old_password";
const PASSWORD = "password";

class UserSchema extends Schema {

    /**
     * @override
     */
    constructor () {
        super('user', paths);
    }

    /**
     * @override
     */
    get projection () {
        return {
            email: true,
            display_name: true,
            slug: true
        };
    }

    /**
     * @override
     */
    _preInsert (doc) {
        const superPreInsert = super._preInsert.bind(this);

        return co(function* () {
            const _doc = deepcopy(yield superPreInsert(doc));

            _doc[HASHED_PASSWORD] = yield generateHash(_doc[PASSWORD]);
            delete _doc[PASSWORD];

            return _doc;
        });
    }

    /**
     * @override
     */
    _preUpdate (oldDoc, newValues, doc) {
        const superPreUpdate = super._preUpdate.bind(this);

        return co(function* () {
            const _doc = deepcopy(yield superPreUpdate(oldDoc, newValues, doc));
            const errors = {};

            if (newValues.hasOwnProperty(PASSWORD)) {
                if (!newValues.hasOwnProperty(OLD_PASSWORD)) {
                    errors[OLD_PASSWORD] = ["To change the password, the current password has to be sent."];
                } else {
                    const result = yield compareHashedStrings(newValues[OLD_PASSWORD], oldDoc[HASHED_PASSWORD]);
                    if (result) {
                        _doc[HASHED_PASSWORD] = yield generateHash(newValues[PASSWORD]);
                    } else {
                        errors[OLD_PASSWORD] = ["The current password sent is not correct."];
                    }
                }
            }

            if (Object.keys(errors).length > 0) {
                throw errors;
            }

            return _doc;
        });
    }

}

export default new UserSchema();