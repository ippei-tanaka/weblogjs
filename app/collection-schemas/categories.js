import validator from 'validator';
//import { ValidationError as VE } from '../errors';

export default {

    name: {
        sanitize: (value) => {
            return String(value);
        },

        validate: (value) => {
            const messages = [];

            if (!validator.isLength(value, {min:1, max: 200})) {
                messages.push('A name should be between 1 and 200 characters.');
            }

            return messages;
        }
    },

    slug: {
        unique: {
            errorMessage : (value) => {
                return `The slug, "${value}", has already been taken.`;
            }
        },

        sanitize: (value) => {
            return String(value);
        },

        validate: (value) => {
            const messages = [];

            if (!validator.isLength(value, {min:1, max: 200})) {
                messages.push('A slug should be between 1 and 200 characters.');
            }

            if (!validator.matches(value, /^[a-zA-Z0-9\-_]*$/)) {
                messages.push('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
            }

            return messages;
        }
    }
}