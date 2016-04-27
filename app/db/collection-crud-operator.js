import co from 'co';
import schemas from '../collection-schemas';
import { ValidationError as VE, DbError } from '../errors';
import { MongoError } from 'mongodb';

export default class CollectionCrudOperator {

    /**
     * @param dbClient {DbClient}
     */
    constructor({collectionName, dbClient}) {
        this._collectionName = collectionName;
        this._dbClient = dbClient;
    }

    insertOne(doc) {
        return co(function* () {
            const collection = yield this._getCollection();
            const cleanDoc = this._sanitize(doc);
            const errors = this._validate(cleanDoc);
            if (errors) throw errors;
            return yield collection.insertOne(cleanDoc);
        }.bind(this)).catch(error => {
            if (error instanceof MongoError && error.code === 11000) {
                const schema = this._getSchema();
                const match = error.message.match(/\s[\w.]+\$([\w]+)_\d+\s.+\{.+:\s"(.+)"\s\}/);
                const pathName = match[1];
                const value = match[2];
                throw {[pathName]: new VE([schema[pathName].unique.errorMessage(value)])};
            }
            throw error;
        });
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
        const errors = {};
        const schema = this._getSchema();

        for (let pathName of Object.keys(schema)) {
            let path = schema[pathName];
            let errorMessages = [];

            if (path.validate) {
                errorMessages = path.validate(doc[pathName]);
            }

            if (errorMessages.length > 0) {
                errors[pathName] = new VE(errorMessages);
            }
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        return null;
    }

    _getSchema() {
        if (!schemas[this._collectionName]) {
            throw new DbError(`collection "${this._collectionName}" doesn't exist in schema.`);
        }
        return schemas[this._collectionName];
    }
}