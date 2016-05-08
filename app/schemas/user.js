import validator from 'validator';
import Schema from './lib/schema';
import co from 'co';
import deepcopy from 'deepcopy';
import bcrypt from 'bcrypt';

const paths = {

    email: {
        unique: true,
        required: true,
        sanitize: (value) => validator.normalizeEmail(value),
        validate: function* (value) {
            if (!validator.isEmail(value)) {
                yield `A ${this.name} should be a valid email.`;
            }
        }
    },

    password: {
        required: true,
        sanitize: (value) => String(value).trim(),
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
        required: true,
        sanitize: (value) => String(value).trim(),
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
        sanitize: (value) => String(value).trim(),
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
    preInsert ({ cleanDoc, errorMap }) {
        const superPreInsert = super.preInsert;
        return co(function* () {
            const spr = yield superPreInsert({ cleanDoc, errorMap });
            const _cleanDoc = deepcopy(spr.cleanDoc);

            _cleanDoc[HASHED_PASSWORD] = yield generateHash(_cleanDoc[PASSWORD]);
            delete _cleanDoc[PASSWORD];

            return {
                cleanDoc: _cleanDoc,
                errorMap: spr.errorMap
            };
        });
    }

    /**
     * @override
     */
    preUpdate ({ oldDoc, newValues, cleanDoc, errorMap }) {
        const superPreUpdate = super.preUpdate;
        return co(function* () {
            const spr = yield superPreUpdate({ oldDoc, newValues, cleanDoc, errorMap });
            const _cleanDoc = spr.cleanDoc;
            const _errorMap = spr.errorMap.clone();

            if (!newValues.hasOwnProperty(PASSWORD)) {
                _errorMap.removeError(PASSWORD);
            } else if (!newValues.hasOwnProperty(OLD_PASSWORD)) {
                _errorMap.setError(OLD_PASSWORD, ["To change the password, the current password has to be sent."]);
            } else {
                const result = yield compareHashedStrings(newValues[OLD_PASSWORD], oldDoc[HASHED_PASSWORD]);
                if (result) {
                    _cleanDoc[HASHED_PASSWORD] = yield generateHash(newValues[PASSWORD]);
                } else {
                    _errorMap.setError(OLD_PASSWORD, ["The current password sent is not correct."]);
                }
            }

            return {
                cleanDoc: _cleanDoc,
                errorMap: _errorMap
            };
        });
    }

}

export default new UserSchema();