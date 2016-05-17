import co from 'co';
import schemas from '../schemas';
import ValidationErrorMap from '../schemas/lib/validation-error-map';
import { DbError } from '../errors';
import { MongoError } from 'mongodb';
import pluralize from 'pluralize';

export default class CollectionCrudOperator {

    /**
     * @param dbClient {DbClient}
     */
    constructor({schemaName, dbClient}) {
        this._dbClient = dbClient;
        this._schema = schemas.getSchema(schemaName);
        this._collectionName = pluralize(schemaName);
    }

    findMany(query = {}, sort = {}, limit = 0, skip = 0) {
        return co(function* () {
            const collection = yield this._getCollection();
            const _query = this._schema.convertToType(query);
            return yield collection
                .find(_query, this._schema.projection)
                .sort(sort)
                .skip(skip)
                .limit(limit).toArray();
        }.bind(this)).catch(this._filterError.bind(this));
    }

    findOne(query) {
        return co(function* () {
            const collection = yield this._getCollection();
            const _query = this._schema.convertToType(query);
            return yield collection.findOne(_query, this._schema.projection);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    insertOne(values) {
        return co(function* () {
            const collection = yield this._getCollection();
            const doc = yield this._schema.createDoc(values);
            return yield collection.insertOne(doc);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    updateOne(query, values) {
        return co(function* () {
            const collection = yield this._getCollection();
            const _query = this._schema.convertToType(query);
            const oldDoc = yield collection.findOne(_query);
            const doc = yield this._schema.updateDoc(oldDoc, values);
            return yield collection.updateOne(
                _query,
                {$set: doc}
            );
        }.bind(this)).catch(this._filterError.bind(this));
    }

    deleteOne(query) {
        return co(function* () {
            const collection = yield this._getCollection();
            const _query = this._schema.convertToType(query);
            return yield collection.deleteOne(_query);
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

    _getCollection() {
        return co(function* () {
            const db = yield this._dbClient.connect();
            return db.collection(this._collectionName);
        }.bind(this));
    }

}