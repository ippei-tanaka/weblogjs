import SchemaModel from './lib/schema-model';
import Schemas from '../schemas';
import CollectionCrudOperator from '../db/collection-crud-operator';

const operator = new CollectionCrudOperator({collectionName: 'posts'});
const schema = Schemas.getSchema('post');

export default class PostModel extends SchemaModel {

    static get name () {
        return "post";
    }

    static get _schema () {
        return schema;
    }

    static get _operator () {
        return operator;
    }

}