import { MongoModel } from 'simple-odm';
import Schemas from '../schemas';

const schema = Schemas.getSchema('post');

export default class PostModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

}