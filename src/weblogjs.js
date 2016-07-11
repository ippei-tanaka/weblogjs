import co from 'co';
import path from 'path';
import UserModel from './models/user-model';
import webpackDevServerRunner from './runners/webpack-dev-server-runner';
import webpackRunner from './runners/webpack-runner';
import dbRunner from './runners/db-runner';
import webServerRunner from './runners/web-server-runner';

const config =
{
    dbHost: "localhost",
    dbPort: 27017,
    dbName: "weblogjs",

    webHost: "localhost",
    webPort: 80,

    webpageRoot: "/",
    adminDir: "admin",
    publicDir: "",

    adminApiRoot: "/api",
    publicApiRoot: "/public-api",
    staticPath: path.resolve(__dirname, "./client/static"),

    sessionSecret: "huashui155HOUDSDe21",

    webpackDevServer: false,
    webpackDevServerHost: "localhost",
    webpackDevServerPort: 3000,

    adminEmail: "t@t.com",
    adminPassword: "tttttttt",
    adminDisplayName: "Admin",
    adminSlug: 'admin'
};


class WeblogJS {

    static setConfig (value)
    {
        Object.assign(config, value);
        return this;
    }

    static getConfig ()
    {
        return Object.assign({}, config);
    }

    static createAdmin ()
    {
        return dbRunner.createUser({
            host: config.dbHost,
            port: config.dbPort,
            database: config.dbName
        }, {
            email: config.adminEmail,
            password: config.adminPassword,
            display_name: config.adminDisplayName,
            slug: config.adminSlug
        });
    }

    static dropDatabase ()
    {
        return dbRunner.dropDatabase({
            host: config.dbHost,
            port: config.dbPort,
            database: config.dbName
        });
    }

    static removeAllDocuments ()
    {
        return dbRunner.removeAllDocuments({
            host: config.dbHost,
            port: config.dbPort,
            database: config.dbName
        });
    }

    static buildBrowserEntryFiles ()
    {
        return webpackRunner.build({
            envVariables: config
        });
    }

    static startBrowserEntryFileServer ()
    {
        return webpackDevServerRunner.start({
            webpackServerHost: config.webpackDevServerHost,
            webpackServerPort: config.webpackDevServerPort,
            envVariables: {
                webpageRootForAdmin: path.resolve(config.webpageRoot, config.adminDir),
                adminApiRoot: config.adminApiRoot
            }
        });
    }

    static startWebServer ()
    {
        return webServerRunner.start({
            dbHost: config.dbHost,
            dbPort: config.dbPort,
            dbName: config.dbName,
            webHost: config.webHost,
            webPort: config.webPort,
            adminDir: config.adminDir,
            publicDir: config.publicDir,
            webpageRoot: config.webpageRoot,
            adminApiRoot: config.adminApiRoot,
            publicApiRoot: config.publicApiRoot,
            sessionSecret: config.sessionSecret,
            webpackDevServerHost: config.webpackDevServerHost,
            webpackDevServerPort: config.webpackDevServerPort,
            staticPath: config.staticPath
        });
    }
}

export default WeblogJS;