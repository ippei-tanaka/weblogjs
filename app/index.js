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
        internalWebHost = "localhost",
        internalWebPort = 3002,
        internalApiRoot = "/api",
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
            basePath: apiRoot,
            authProtection: true
        });

        this._webServer = new WebServer({
            host: webHost,
            port: webPort,
            sessionSecret: sessionSecret,
            webpageRouter: webpageRouter,
            apiRouter: restfulApiRouter,
            PassportManager: PassportManager
        });

        const internalRestfulApiRouter = new RestfulApiRouter({
            basePath: internalApiRoot,
            authProtection: false
        });

        this._internalWebServer =  new WebServer({
            host: internalWebHost,
            port: internalWebPort,
            sessionSecret: sessionSecret,
            apiRouter: internalRestfulApiRouter
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
     * @returns {WebServer}
     */
    get internalWebServer() {
        return this._internalWebServer;
    }

    /**
     * @returns {DbSettingOperator}
     */
    get dbSettingOperator() {
        return DbSettingOperator;
    }

    createUser (user) {
        return new UserModel(user).save();
    }
}

export default new WeblogJS();