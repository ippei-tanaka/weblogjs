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

    get published () {
        const values = this.values;
        const isDraft = values.is_draft || false;
        const publishTime = values.publish_date ? values.publish_date.getTime() : Number.MAX_SAFE_INTEGER;
        return !isDraft && publishTime < new Date().getTime();
    }

}