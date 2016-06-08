import SchemaModel from './lib/schema-model';
import Schemas from '../schemas';
import CollectionCrudOperator from '../db/collection-crud-operator';

const operator = new CollectionCrudOperator({collectionName: 'blogs'});
const schema = Schemas.getSchema('blog');

export default class BlogModel extends SchemaModel {

    static get name () {
        return "blog";
    }

    static get _schema () {
        return schema;
    }

    static get _operator () {
        return operator;
    }

}