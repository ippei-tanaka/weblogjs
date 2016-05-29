import Schema from './lib/schema';
import Types from './lib/types';

const schema = new Schema('setting', {

    front_blog_id: {
        unique: true,
        required: true,
        type: Types.ObjectID,
        validate: function* (value) {
            if (!value) {
                yield `"${value}" is an invalid ID.`
            }
        }
    }

});

export default schema;