import SchemaModel from './lib/schema-model';
import Schemas from '../schemas';
import PathModel from './lib/path-model';
import CollectionCrudOperator from '../db/collection-crud-operator';

const operator = new CollectionCrudOperator({collectionName: 'users'});
const schema = Schemas.getSchema('user');

export default class UserModel extends SchemaModel {

    static get name () {
        return "user";
    }

    static get _schema () {
        return schema;
    }

    static get _operator () {
        return operator;
    }

    checkPassword (password) {
        return this.constructor._schema.compareHashedStrings(password, this.rawValues.hashed_password);
    }
}