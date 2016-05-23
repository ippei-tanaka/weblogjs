require('babel-register');
require('babel-polyfill');

import co from 'co';
import WebServer from './server';
import WebpageRouter from './web-pages/router';
import RestfulApiRouter from './restful-api/router';
import DbClient from './db/db-client';
import DbSettingOperator from './db/db-setting-operator';
import PassportManager from './passport-manager';
import UserModel from './models/user-model';

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
        return UserModel.insertOne(user);
    }
}

export default new WeblogJS();