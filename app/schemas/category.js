import validator from 'validator';
import Schema from './schema';


const schema = new Schema('category', {

    name: {
        sanitize: (value) => {
            return String(value);
        },

        validate: function (value) {
            const messages = [];

            if (!value) {
                messages.push(`A ${this.name} is required.`);
                return messages;
            }

            if (!validator.isLength(value, {min:1, max: 200})) {
                messages.push(`A ${this.name} should be between 1 and 200 characters.`);
            }

            return messages;
        }
    },

    slug: {
        unique: {
            errorMessage : function (value) {
                return `The ${this.name}, "${value}", has already been taken.`;
            }
        },

        sanitize: (value) => {
            return String(value);
        },

        validate: function (value) {
            const messages = [];

            if (!value) {
                messages.push(`A ${this.name} is required.`);
                return messages;
            }

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