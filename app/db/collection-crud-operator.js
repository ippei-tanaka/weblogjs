import co from 'co';
import schemas from '../collection-schemas';
import { ValidationError as VE, DbError } from '../errors';
import { MongoError, ObjectID } from 'mongodb';

export default class CollectionCrudOperator {

    /**
     * @param dbClient {DbClient}
     */
    constructor({collectionName, dbClient}) {
        this._collectionName = collectionName;
        this._dbClient = dbClient;
    }

    findMany (query) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.find(query).toArray();
        }.bind(this)).catch(this._filterError.bind(this));
    }

    findOne (id) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.findOne({_id: new ObjectID(id)});
        }.bind(this)).catch(this._filterError.bind(this));
    }

    insertOne(doc) {
        return co(function* () {
            const collection = yield this._getCollection();
            const cleanDoc = this._sanitize(doc);
            this._validate(cleanDoc);
            return yield collection.insertOne(cleanDoc);
        }.bind(this)).catch(this._filterError.bind(this));
    }

    updateOne(id, doc) {
        return co(function* () {
            const collection = yield this._getCollection();
            const cleanDoc = this._sanitize(doc);
            this._validate(cleanDoc);
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

    _filterError (error) {
        if (error instanceof ValidationErrorMap) {
            throw error;
        }

        if (error instanceof MongoError && error.code === 11000) {
            const schema = this._getSchema();
            const match = error.message.match(/\s[\w.]+\$([\w]+)_\d+\s.+\{.+:\s"(.+)"\s\}/);
            const pathName = match[1];
            const value = match[2];
            const errorMap = new ValidationErrorMap();
            errorMap.addError(pathName, [schema[pathName].unique.errorMessage(value)]);
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

    _sanitize(doc) {
        const cleanDoc = {};
        const schema = this._getSchema();

        for (let pathName of Object.keys(schema)) {
            let path = schema[pathName];

            if (path.sanitize) {
                cleanDoc[pathName] = path.sanitize(doc[pathName]);
            }
        }

        if (doc._id) {
            cleanDoc._id = doc._id;
        }

        return cleanDoc;
    }

    _validate(doc) {
        const errorMap = new ValidationErrorMap();
        const schema = this._getSchema();

        for (let pathName of Object.keys(schema)) {
            let path = schema[pathName];
            let errorMessages = [];

            if (path.validate) {
                errorMessages = path.validate(doc[pathName]);
            }

            if (errorMessages.length > 0) {
                errorMap.addError(pathName, errorMessages);
            }
        }

        if (!errorMap.isEmpty()) {
            throw errorMap;
        }
    }

    _getSchema() {
        if (!schemas[this._collectionName]) {
            throw new DbError(`collection "${this._collectionName}" doesn't exist in schema.`);
        }
        return schemas[this._collectionName];
    }
}

class ValidationErrorMap {

    constructor () {
        this._errorMap = {};
    }

    /**
     * @param pathName {string}
     * @param errorMessages {string[]}
     */
    addError (pathName, errorMessages) {
        this._errorMap[pathName] = errorMessages.map(msg => new VE(msg));
    }

    isEmpty () {
        return Object.keys(this._errorMap).length === 0
    }

    toJSON() {
        return this._errorMap;
    }
}