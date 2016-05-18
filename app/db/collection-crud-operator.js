import co from 'co';
//import schemas from '../schemas';
//import ValidationErrorMap from '../schemas/lib/validation-error-map';
import { UniqueIndexDbError } from '../errors';
import { MongoError } from 'mongodb';
//import pluralize from 'pluralize';
import DbClient from './db-client';

export default class CollectionCrudOperator {

    /**
     * @param dbClient {DbClient}
     */
    constructor({collectionName}) {
        //this._schema = schemas.getSchema(schemaName);
        this._collectionName = collectionName;//pluralize(schemaName);
    }

    findMany(query = {}, sort = {}, limit = 0, skip = 0, projection = {}) {
        return co(function* () {
            const collection = yield this._getCollection();
            //const _query = this._schema.convertToType(query);
            return yield collection
                .find(query, projection)
                .sort(sort)
                .skip(skip)
                .limit(limit).toArray();
        }.bind(this)).catch(this._filterError.bind(this));
    }

    findOne(query = {}, projection = {}) {
        return co(function* () {
            const collection = yield this._getCollection();
            //const _query = this._schema.convertToType(query);
            return yield collection.findOne(query, projection);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    insertOne(values) {
        return co(function* () {
            const collection = yield this._getCollection();
            //const doc = yield this._schema.createDoc(values);
            return yield collection.insertOne(values);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    updateOne(query, values) {
        return co(function* () {
            const collection = yield this._getCollection();
            //const _query = this._schema.convertToType(query);
            const oldDoc = yield collection.findOne(query);
            //const doc = yield this._schema.updateDoc(oldDoc, values);
            return yield collection.updateOne(
                query,
                {$set: values}
            );
        }.bind(this)).catch(this._filterError.bind(this));
    }

    deleteOne(query) {
        return co(function* () {
            const collection = yield this._getCollection();
            //const _query = this._schema.convertToType(query);
            return yield collection.deleteOne(query);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    _filterError(error) {
        /*
        if (error instanceof ValidationErrorMap) {
            throw error;
        }
        */

        if (error instanceof MongoError && error.code === 11000) {
            const match = error.message.match(/\s[\w.]+\$([\w]+)_\d+\s.+\{.+:\s"(.+)"\s\}/);
            const pathName = match[1];
            const value = match[2];
            //const errorMap = new ValidationErrorMap();
            //errorMap.setError(pathName, [this._schema.getPath(pathName).getUniqueErrorMessage(value)]);
            throw new UniqueIndexDbError({pathName, value});
        }

        //console.log("_filterError:");
        //console.error(error);
        //throw new Error();
    }

    _getCollection() {
        return co(function* () {
            const db = yield DbClient.connect();
            return db.collection(this._collectionName);
        }.bind(this));
    }

}