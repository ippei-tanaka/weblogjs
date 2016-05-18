import co from 'co';
import Schemas from '../schemas';
import CollectionCrudOperator from '../db/collection-crud-operator';
import pluralize from 'pluralize';
import { MongoError } from 'mongodb';
import ValidationErrorMap from '../schemas/lib/validation-error-map';

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
        }.bind(this)).catch(this._filterError.bind(this));
    }

    findOne (query) {
        return co(function* () {
            const _query = this._schema.convertToType(query);
            return yield this._operator.findOne(_query, this._schema.projection);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    insertOne (values) {
        return co(function* () {
            return yield this._operator.insertOne(yield this._schema.createDoc(values));
        }.bind(this)).catch(this._filterError.bind(this));
    }

    updateOne (query, values) {
        return co(function* () {
            const _query = this._schema.convertToType(query);
            const oldDoc = yield this._operator.findOne(_query);
            const doc = yield this._schema.updateDoc(oldDoc, values);
            return yield this._operator.updateOne(_query, doc);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    deleteOne (query) {
        return co(function* () {
            yield this._operator.deleteOne(this._schema.convertToType(query));
        }.bind(this)).catch(this._filterError.bind(this));
    }

    _filterError(error) {
        if (error instanceof ValidationErrorMap) {
            throw error;
        }

        if (error instanceof MongoError && error.code === 11000) {
            const match = error.message.match(/\s[\w.]+\$([\w]+)_\d+\s.+\{.+:\s"(.+)"\s\}/);
            const pathName = match[1];
            const value = match[2];
            const errorMap = new ValidationErrorMap();
            errorMap.setError(pathName, [this._schema.getPath(pathName).getUniqueErrorMessage(value)]);
            throw errorMap;
        }

        console.log("_filterError:");
        console.error(error);
        throw new Error();
    }
}