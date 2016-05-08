import validator from 'validator';
import Schema from './lib/schema';

const schema = new Schema('blog', {

    name: {
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

    posts_per_page: {
        required: true,
        sanitize: (value) => Number.parseInt(value) || 0,
        validate: function* (value) {
            if (value < 1) {
                yield `A ${this.name} should be greater than 0.`;
            }
        }
    }

});

export default schema;