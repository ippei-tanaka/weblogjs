import Schema from './lib/schema';
import Types from './lib/types';

const schema = new Schema('setting', {

    front_blog_id: {
        unique: true,
        required: true,
        display_name: "front blog ID",
        type: Types.ObjectID,
        validate: function* (value) {
            if (!value) {
                yield `"${value}" is an invalid ID.`
            }
        }
    },

    posts_per_page: {
        display_name: "posts per page",
        type: Types.Integer,
        default_value: 10,
        validate: function* (value) {
            if (value < 1) {
                yield `The ${this.displayName} should be greater than 0.`;
            }
        }
    }

});

export default schema;