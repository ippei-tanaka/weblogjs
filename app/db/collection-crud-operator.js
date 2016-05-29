import co from 'co';
import DbClient from './db-client';

export default class CollectionCrudOperator {

    constructor({collectionName}) {
        this._collectionName = collectionName;
    }

    findMany(query = {}, sort = {}, limit = 0, skip = 0, projection = {}) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection
                .find(query, projection)
                .sort(sort)
                .skip(skip)
                .limit(limit).toArray();
        }.bind(this));
    }

    findOne(query = {}, projection = {}) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.findOne(query, projection);
        }.bind(this));
    }

    insertOne(values) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.insertOne(values);
        }.bind(this));
    }

    updateOne(query, values) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.updateOne(
                query,
                {$set: values}
            );
        }.bind(this));
    }

    deleteOne(query) {
        return co(function* () {
            const collection = yield this._getCollection();
            return yield collection.deleteOne(query);
        }.bind(this));
    }

    aggregate(query) {
        return co(function* () {
            const collection = yield this._getCollection();

            return yield new Promise((resolve, reject) => {
                collection.aggregate(query, function (err, result) {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        }.bind(this));
    }

    _getCollection() {
        return co(function* () {
            const db = yield DbClient.connect();
            return db.collection(this._collectionName);
        }.bind(this));
    }

}