import validator from 'validator';
import Schema from './schema';
import co from 'co';

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
        const _cleanDoc = Object.assign({}, cleanDoc);

        _cleanDoc.hashed_password = "$$$$????";
        delete _cleanDoc.password;

        return Promise.resolve({ cleanDoc: _cleanDoc, errorMap });
    }

    /**
     * @override
     */
    preUpdate ({ oldDoc, newValues, cleanDoc, errorMap }) {
        if (!newValues.hasOwnProperty("password")) {
            errorMap.removeError("password");
        } else if (!newValues.hasOwnProperty("old_password")) {
            errorMap.setError("password", ["Fddd!!!!"]);
        }
        return Promise.resolve({ cleanDoc, errorMap });
    }

}

export default new UserSchema();