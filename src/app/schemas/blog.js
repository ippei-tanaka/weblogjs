import validator from 'validator';
import { types, eventHub } from '../../../../simple-odm';
import { WeblogJsSchema, modifyDateData } from './weblogjs-schema';

const schema = new WeblogJsSchema({

    name: 'blog',

    paths: {
        name: {
            required: true,
            type: types.String,
            sanitize: (value) => value.trim(),
            validate: function* (value)
            {
                const range = {min: 1, max: 200};
                if (!validator.isLength(value, range))
                {
                    yield `A ${this.displayName} should be between ${range.min} and ${range.max} characters.`;
                }
            }
        },

        slug: {
            unique: true,
            required: true,
            type: types.String,
            sanitize: (value) => value.trim(),
            validate: function* (value)
            {
                const range = {min: 1, max: 200};
                if (!validator.isLength(value, range))
                {
                    yield `A ${this.displayName} should be between ${range.min} and ${range.max} characters.`;
                }

                if (!validator.matches(value, /^[a-zA-Z0-9\-_]*$/))
                {
                    yield `Only alphabets, numbers and some symbols (-, _) are allowed for a ${this.name}.`;
                }
            }
        },

        posts_per_page: {
            required: true,
            display_name: "posts per page",
            type: types.Integer,
            validate: function* (value)
            {
                if (value < 1)
                {
                    yield `The ${this.displayName} should be greater than 0.`;
                }
            }
        }

    }
});

eventHub.on(schema.BEFORE_SAVED, modifyDateData);

export default schema;