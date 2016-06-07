require('babel-register');
require('babel-polyfill');

import co from 'co';
import WebServer from './server';
import WebpageRouter from './web-pages/router';
import AdminRestfulApiRouter from './restful-api/admin-router';
import PublicRestfulApiRouter from './restful-api/public-router';
import DbClient from './db/db-client';
import DbSettingOperator from './db/db-setting-operator';
import PassportManager from './passport-manager';
import UserModel from './models/user-model';
import { getEnv } from '../env-variables';

const WEBLOG_ENV = getEnv();

class WeblogJS {

    constructor() {}

    init({
        dbHost = WEBLOG_ENV.db_host,
        dbPort = WEBLOG_ENV.db_port,
        dbName = WEBLOG_ENV.db_name,
        webHost = WEBLOG_ENV.web_host,
        webPort = WEBLOG_ENV.web_port,
        webPageRoot = WEBLOG_ENV.webpage_root,
        apiRoot = WEBLOG_ENV.admin_api_root,
        publicApiRoot = WEBLOG_ENV.public_api_root,
        sessionSecret = WEBLOG_ENV.session_secret
        } = {})
    {

        DbClient.init({
            host: dbHost,
            port: dbPort,
            database: dbName
        });

        const webpageRouter = new WebpageRouter(webPageRoot);

        const restfulApiRouter = new AdminRestfulApiRouter({
            basePath: apiRoot
        });

        const publicRestfulApiRouter = new PublicRestfulApiRouter({
            basePath: publicApiRoot
        });

        this._webServer = new WebServer({
            host: webHost,
            port: webPort,
            sessionSecret: sessionSecret,
            webpageRouter: webpageRouter,
            apiRouter: restfulApiRouter,
            publicApiRouter: publicRestfulApiRouter,
            PassportManager: PassportManager
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
        return new UserModel(user).save();
    }
}

export default new WeblogJS();