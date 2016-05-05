import validator from 'validator';
import Schema from './schema';


const schema = new Schema('category', {

    name: {
        required: true,

        sanitize: (value) => String(value),

        validate: function (value) {
            const messages = [];

            if (!validator.isLength(value, {min:1, max: 200})) {
                messages.push(`A ${this.name} should be between 1 and 200 characters.`);
            }

            return messages;
        }
    },

    slug: {
        unique: true,

        required: true,

        sanitize: (value) => String(value),

        validate: function (value) {
            const messages = [];

            if (!validator.isLength(value, {min:1, max: 200})) {
                messages.push(`A ${this.name} should be between 1 and 200 characters.`);
            }

            if (!validator.matches(value, /^[a-zA-Z0-9\-_]*$/)) {
                messages.push(`Only alphabets, numbers and some symbols (-, _) are allowed for a ${this.name}.`);
            }

            return messages;
        }
    }

});

export default schema;