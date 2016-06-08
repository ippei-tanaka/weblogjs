import SchemaModel from './lib/schema-model';
import Schemas from '../schemas';
import CollectionCrudOperator from '../db/collection-crud-operator';

const operator = new CollectionCrudOperator({collectionName: 'categories'});
const schema = Schemas.getSchema('category');

export default class CategoryModel extends SchemaModel {

    static get name () {
        return "category";
    }

    static get _schema () {
        return schema;
    }

    static get _operator () {
        return operator;
    }

}