import { MongoClient } from 'mongodb';
import co from 'co';

let initialized = false;

class DbClient {

    constructor() {}

    init({host,port,database}) {
        if (initialized) throw new Error("DbClient has been initialized.");

        initialized = true;
        this._host = host;
        this._port = port;
        this._database = database;
        this._instance = null;
    }

    connect() {
        if (!initialized) throw new Error("DbClient has not been initialized.");

        return co(function*() {
            if (!this._instance) {
                this._instance = yield MongoClient.connect(this._buildUrl());
                this._instance.on("close", this._onDisconnected.bind(this));
            }
            return this._instance;
        }.bind(this)).catch((err) => {
            console.error(err.stack);
            this._instance = null;
        });
    }

    _buildUrl() {
        const {_host, _port, _database} = this;
        return `mongodb://${_host}:${_port}/${_database}`;
    }

    _onDisconnected(error) {
        console.log("Connection to the database was closed!");
        this._instance = null;
    }

}

export default new DbClient();