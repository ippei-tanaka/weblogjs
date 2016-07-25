import { types, eventHub } from 'simple-odm';
import { WeblogJsSchema, modifyDateData } from './weblogjs-schema';

const schema = new WeblogJsSchema({

    name: 'setting',

    paths: {
        front_blog_id: {
            unique: true,
            required: true,
            display_name: "front blog ID",
            type: types.MongoObjectID,
            validate: function* (value)
            {
                if (!value)
                {
                    yield `"${value}" is an invalid ID.`
                }
            }
        }
    }
});

eventHub.on(schema.BEFORE_SAVED, modifyDateData);

export default schema;