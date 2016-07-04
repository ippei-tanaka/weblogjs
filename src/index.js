import co from 'co';
import WebServer from './web-server';
import WebpageRouter from './routers/webpage-router';
import RestfulApiAdminRouter from './routers/restful-api-admin-router';
import RestfulApiPublicRouter from './routers/restful-api-public-router';
import { mongoDriver, mongoDbBaseOperator, types } from 'simple-odm'
import PassportManager from './passport-manager';
import UserModel from './models/user-model';
import { getEnv } from './env-variables';

const WEBLOG_ENV = getEnv();

class WeblogJS {

    constructor () {}

    init (
        {
            dbHost = WEBLOG_ENV.db_host,
            dbPort = WEBLOG_ENV.db_port,
            dbName = WEBLOG_ENV.db_name,
            webHost = WEBLOG_ENV.web_host,
            webPort = WEBLOG_ENV.web_port,
            apiRoot = WEBLOG_ENV.admin_api_root,
            publicApiRoot = WEBLOG_ENV.public_api_root,
            staticPath = WEBLOG_ENV.static_path,
            adminDir = WEBLOG_ENV.admin_dir,
            publicDir = WEBLOG_ENV.public_dir,
            webpageRoot = WEBLOG_ENV.webpage_root,
            sessionSecret = WEBLOG_ENV.session_secret
            } = {}
    )
    {

        mongoDriver.setUp({
            host: dbHost,
            port: dbPort,
            database: dbName
        });

        this._dbOperator = mongoDbBaseOperator;

        const webpageRouter = new WebpageRouter({
            adminDir,
            publicDir,
            webpageRoot
        });

        const adminApiRouter = new RestfulApiAdminRouter({
            basePath: apiRoot
        });

        const publicApiRouter = new RestfulApiPublicRouter({
            basePath: publicApiRoot
        });

        this._webServer = new WebServer({
            host: webHost,
            port: webPort,
            sessionSecret,
            webpageRouter,
            adminApiRouter,
            publicApiRouter,
            PassportManager,
            staticPath
        });

        return this;
    }

    /**
     * @returns {WebServer}
     */
    get webServer ()
    {
        return this._webServer;
    }

    dropDatabase ()
    {
        return this._dbOperator.dropDatabase();
    }

    removeAllDocuments ()
    {
        return this._dbOperator.removeAllDocuments();
    }

    createUser (user)
    {
        return co(function* ()
        {
            const model = new UserModel(user);
            yield model.save();
        })
    }
}

export default new WeblogJS();