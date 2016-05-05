import co from 'co';
import schemas from '../schemas';
import ValidationErrorMap from '../schemas/validation-error-map';
import { DbError } from '../errors';
import { MongoError, ObjectID } from 'mongodb';
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

    findMany(query) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.find(query).toArray();
        }.bind(this)).catch(this._filterError.bind(this));
    }

    findOne(id) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.findOne({_id: new ObjectID(id)});
        }.bind(this)).catch(this._filterError.bind(this));
    }

    insertOne(doc) {
        return co(function* () {
            const collection = yield this._getCollection();
            const { cleanDoc, errorMap } = this._schema.examine(doc);
            if (!errorMap.isEmpty()) throw errorMap;
            return yield collection.insertOne(cleanDoc);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    updateOne(id, doc) {
        return co(function* () {
            const collection = yield this._getCollection();
            const { cleanDoc, errorMap } = this._schema.examine(doc);
            if (!errorMap.isEmpty()) throw errorMap;
            return yield collection.updateOne(
                {_id: new ObjectID(id)},
                {$set: cleanDoc}
            );
        }.bind(this)).catch(this._filterError.bind(this));
    }

    deleteOne(id) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.deleteOne({_id: new ObjectID(id)});
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
            errorMap.addError(pathName, [this._schema.getPath(pathName).getUniqueErrorMessage(value)]);
            throw errorMap;
        }

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