import validator from 'validator';
import Schema from './lib/schema';
import { objectIDfy } from './lib/sanitizers';

const schema = new Schema('post', {

    title: {
        required: true,
        sanitize: (value) => String(value).trim(),
        validate: function* (value) {
            const range = {min:1, max: 200};
            if (!validator.isLength(value, range)) {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
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
    },

    content: {
        required: true,
        sanitize: (value) => String(value).trim(),
        validate: function* (value) {
            const range = {min:1, max: 30000};
            if (!validator.isLength(value, range)) {
                yield `A ${this.name} should be between ${range.min} and ${range.max} characters.`;
            }
        }
    },

    author_id: {
        display_name: "author ID",
        sanitize: objectIDfy,
        validate: function* (value) {
            if (!value) {
                yield `"${value}" is an invalid ID.`
            }
        }
    },

    category_id: {
        display_name: "category ID",
        sanitize: objectIDfy,
        validate: function* (value) {
            if (!value) {
                yield `"${value}" is an invalid ID.`
            }
        }
    },

    blog_id: {
        display_name: "blog ID",
        sanitize: objectIDfy,
        validate: function* (value) {
            if (!value) {
                yield `"${value}" is an invalid ID.`
            }
        }
    }

});

export default schema;