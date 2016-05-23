import SchemaModel from './lib/schema-model';
import Schemas from '../schemas';
import PathModel from './lib/path-model';
import CollectionCrudOperator from '../db/collection-crud-operator';

const operator = new CollectionCrudOperator({collectionName: 'users'});
const schema = Schemas.getSchema('user');
const PathModels = {};

for (let path of schema) {
    const _PathModel = class extends PathModel {
        static get _path () {
            return path;
        }
    };
    PathModels[path.name] = _PathModel;
}

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