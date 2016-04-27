import co from 'co';
import schemas from '../collection-schemas';
import { DbError } from '../errors';

export default class DbSettingOperator {

    /**
     * @param dbClient {DbClient}
     */
    constructor ({dbClient}) {
        this._dbClient = dbClient;
    }

    createIndexes () {
        return co(function* () {

            const db = yield this._dbClient.connect();

            for (let collectionName of Object.keys(schemas)) {
                const schema = schemas[collectionName];

                for (let pathName of Object.keys(schema)) {
                    const path = schema[pathName];

                    if (path.unique) {
                        yield db.collection(collectionName).createIndex({[pathName]: 1}, {unique: true});
                    }
                }
            }

        }.bind(this)).catch(() => {
            throw new DbError("An error occurred during createIndexes.");
        });
    }

    removeAllDocuments () {
        return co(function* () {
            const db = yield this._dbClient.connect();
            const collections = yield db.listCollections().toArray();

            for (let c of collections) {
                const collection = db.collection(c.name);
                try {
                    yield collection.deleteMany({});
                } catch (e) {
                }
            }
        }.bind(this)).catch(() => {
            throw new DbError("An error occurred during removeAllDocuments.");
        });
    }

    dropDatabase () {
        return co(function* () {
            const db = yield this._dbClient.connect();
            yield db.dropDatabase();
        }.bind(this)).catch(() => {
            throw new DbError("An error occurred during dropDatabase.");
        });
    }

}