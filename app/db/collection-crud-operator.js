import co from 'co';
import schemas from '../schemas';
import ValidationErrorMap from '../schemas/lib/validation-error-map';
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

    findMany(query = {}, sort = {}, limit = 0) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection
                .find(query, this._schema.projection)
                .sort(sort).limit(limit).toArray();
        }.bind(this)).catch(this._filterError.bind(this));
    }

    findOne(query) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.findOne(query, this._schema.projection);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    findOneById(id) {
        return this.findOne({_id: new ObjectID(id)});
    }

    insertOneById(doc) {
        return co(function* () {
            const collection = yield this._getCollection();
            const result = this._schema.examine(doc);
            const { cleanDoc, errorMap } = yield this._schema.preInsert(result);
            if (!errorMap.isEmpty()) throw errorMap;
            return yield collection.insertOne(cleanDoc);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    updateOneById(id, values) {
        return co(function* () {
            const collection = yield this._getCollection();
            const oldDoc = yield collection.findOne({_id: new ObjectID(id)});
            const oldDocForMerge = yield collection.findOne({_id: new ObjectID(id)}, this._schema.projection);
            const mergedDoc = Object.assign({}, oldDocForMerge, values);
            const result = this._schema.examine(mergedDoc);
            const { cleanDoc, errorMap } = yield this._schema.preUpdate({
                oldDoc,
                newValues: values,
                cleanDoc: result.cleanDoc,
                errorMap: result.errorMap
            });
            if (!errorMap.isEmpty()) throw errorMap;
            return yield collection.updateOne(
                {_id: new ObjectID(id)},
                {$set: cleanDoc}
            );
        }.bind(this)).catch(this._filterError.bind(this));
    }

    deleteOneById(id) {
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
            errorMap.setError(pathName, [this._schema.getPath(pathName).getUniqueErrorMessage(value)]);
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