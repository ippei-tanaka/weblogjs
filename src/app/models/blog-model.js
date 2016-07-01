import { MongoModel } from 'simple-odm';
import Schemas from '../schemas';

const schema = Schemas.getSchema('blog');

export default class BlogModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

}