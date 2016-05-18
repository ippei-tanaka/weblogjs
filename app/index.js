require('babel-register');
require('babel-polyfill');

import co from 'co';
import WebServer from './server';
import WebpageRouter from './web-pages/router';
import RestfulApiRouter from './restful-api/router';
import DbClient from './db/db-client';
import DbSettingOperator from './db/db-setting-operator';
import CollectionCrudOperator from './db/collection-crud-operator';
import PassportManager from './passport-manager';
import Schema from './schemas';

class WeblogJS {

    constructor() {}

    init({
        dbHost = "localhost",
        dbPort = 27017,
        dbName = "weblogjs",
        webHost = "localhost",
        webPort = 80,
        webPageRoot = "/",
        apiRoot = "/api",
        sessionSecret = "keyboard cat"
        } = {}
    ) {

        DbClient.init({
            host: dbHost,
            port: dbPort,
            database: dbName
        });

        const webpageRouter = new WebpageRouter(webPageRoot);

        const restfulApiRouter = new RestfulApiRouter({
            basePath: apiRoot
        });

        const webServer = new WebServer({
            host: webHost,
            port: webPort,
            sessionSecret: sessionSecret,
            webpageRouter: webpageRouter,
            apiRouter: restfulApiRouter
        });

        this._webServer = webServer;
        this._userOperator = new CollectionCrudOperator({
            collectionName: "users"
        });

        return this;
    }

    /**
     * @returns {WebServer}
     */
    get webServer() {
        return this._webServer;
    }

    /**
     * @returns {DbSettingOperator}
     */
    get dbSettingOperator() {
        return DbSettingOperator;
    }

    createUser (user) {
        return co(function* () {
            const doc = yield Schema.getSchema('user').createDoc(user);
            return yield this._userOperator.insertOne(doc);
        }.bind(this));
    }
}

export default new WeblogJS();