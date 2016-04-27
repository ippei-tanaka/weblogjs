require('babel-register');
require('babel-polyfill');

import co from 'co';
import WebServer from './server';
import WebpageRouter from './web-pages/router';
import RestfulApiRouter from './restful-api/router';
import DbClient from './db/db-client';
import DbSettingOperator from './db/db-setting-operator';

export default class WeblogJS {

    constructor({
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

        const dbClient = new DbClient({
            host: dbHost,
            port: dbPort,
            database: dbName
        });

        const webpageRouter = new WebpageRouter(webPageRoot);

        const restfulApiRouter = new RestfulApiRouter({basePath: apiRoot, dbClient});

        const webServer = new WebServer({
            host: webHost,
            port: webPort,
            sessionSecret: sessionSecret,
            webpageRouter: webpageRouter,
            apiRouter: restfulApiRouter
        });

        this._dbSettingOperator = new DbSettingOperator({dbClient});
        this._webServer = webServer;
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
        return this._dbSettingOperator;
    }
}