import co from 'co';
import Schemas from '../schemas';
import CollectionCrudOperator from '../db/collection-crud-operator';
import pluralize from 'pluralize';

export default class ModelOperator {

    constructor({schemaName}) {
        const collectionName = pluralize(schemaName);
        this._operator = new CollectionCrudOperator({collectionName});
        this._schema = Schemas.getSchema(schemaName);
    }

    findMany ({query, sort, limit, skip}) {
        return co(function* () {
            const _query = this._schema.convertToType(query);
            return yield this._operator.findMany(_query, sort, limit, skip, this._schema.projection);
        }.bind(this));
    }

    findOne (query) {
        return co(function* () {
            const _query = this._schema.convertToType(query);
            return yield this._operator.findOne(_query, this._schema.projection);
        }.bind(this));
    }

    insertOne (values) {
        return co(function* () {
            return yield this._operator.insertOne(yield this._schema.createDoc(values));
        }.bind(this));
    }

    updateOne (query, values) {
        return co(function* () {
            const _query = this._schema.convertToType(query);
            const oldDoc = yield this._operator.findOne(_query);
            const doc = yield this._schema.updateDoc(oldDoc, values);
            return yield this._operator.updateOne(_query, doc);
        }.bind(this));
    }

    deleteOne (query) {
        return co(function* () {
            yield this._operator.deleteOne(this._schema.convertToType(query));
        }.bind(this));
    }
}