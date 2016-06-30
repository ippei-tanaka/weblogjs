import { MongoModel } from '../../../../simple-odm';
import Schemas from '../schemas';

const schema = Schemas.getSchema('category');

export default class CategoryModel extends MongoModel {

    static get name () {
        return schema.name;
    }

    static get schema () {
        return schema;
    }

}