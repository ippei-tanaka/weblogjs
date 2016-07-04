import { MongoModel } from 'simple-odm';
import schema from './blog-schema';

export default class BlogModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

}