import validator from 'validator';
import Schema from './schema';
import co from 'co';
import deepcopy from 'deepcopy';

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

            _cleanDoc.hashed_password = "$$$$????";
            delete _cleanDoc.password;

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

            if (!newValues.hasOwnProperty("password")) {
                _errorMap.removeError("password");
            } else if (!newValues.hasOwnProperty("old_password")) {
                _errorMap.setError("password", ["Fddd!!!!"]);
            }

            return {
                cleanDoc: _cleanDoc,
                errorMap: _errorMap
            };
        });
    }

}

export default new UserSchema();