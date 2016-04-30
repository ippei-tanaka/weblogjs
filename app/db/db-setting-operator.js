import co from 'co';
import schemas from '../schemas';
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

            for (let schema of schemas) {
                for (let path of schema) {
                    if (path.isUnique) {
                        yield db.collection(schema.name).createIndex({[path.name]: 1}, {unique: true});
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