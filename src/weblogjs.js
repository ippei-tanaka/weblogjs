import co from 'co';
import path from 'path';
import webpackDevServerRunner from './runners/webpack-dev-server-runner';
import webpackRunner from './runners/webpack-runner';
import dbRunner from './runners/db-runner';
import webServerRunner from './runners/web-server-runner';

const config =
{
    dbHost: "localhost",
    dbPort: 27017,
    dbName: "weblogjs",

    webProtocol: "http",
    webHost: "localhost",
    webPort: 80,

    webpageRoot: "/",
    adminDir: "admin",
    publicDir: "",

    adminApiRoot: "/api",
    publicApiRoot: "/public-api",
    staticPath: path.resolve(__dirname, "../static"),

    sessionSecret: "huashui155HOUDSDe21",

    webpackDevServer: false,
    webpackDevServerHost: "localhost",
    webpackDevServerPort: 3000,

    adminEmail: "t@t.com",
    adminPassword: "tttttttt",
    adminDisplayName: "Admin",
    adminSlug: 'admin',

    defaultBlogName: "My Blog",
    defaultBlogSlug: "my-blog",
    defaultBlogPostPerPage: 1
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

    static createDefaultBlog ()
    {
        return dbRunner.createBlog({
            host: config.dbHost,
            port: config.dbPort,
            database: config.dbName
        }, {
            name: config.defaultBlogName,
            slug: config.defaultBlogSlug,
            posts_per_page: config.defaultBlogPostPerPage
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
            staticPath: config.staticPath,
            webpageRootForAdmin: path.resolve(config.webpageRoot, config.adminDir),
            webpageRootForPublic: path.resolve(config.webpageRoot, config.publicDir),
            adminApiRoot: config.adminApiRoot,
            publicApiRoot: config.publicApiRoot,
            webProtocol: config.webProtocol,
            webHost: config.webHost,
            webPort: config.webPort
        });
    }

    static startBrowserEntryFileServer ()
    {
        return webpackDevServerRunner.start({
            staticPath: config.staticPath,
            webpackServerHost: config.webpackDevServerHost,
            webpackServerPort: config.webpackDevServerPort,
            webpageRootForAdmin: path.resolve(config.webpageRoot, config.adminDir),
            adminDir: config.adminDir,
            webpageRootForPublic: path.resolve(config.webpageRoot, config.publicDir),
            publicDir: config.publicDir,
            adminApiRoot: config.adminApiRoot,
            publicApiRoot: config.publicApiRoot,
            webProtocol: config.webProtocol,
            webHost: config.webHost,
            webPort: config.webPort
        });
    }

    static startWebServer ()
    {
        return webServerRunner.start({
            dbHost: config.dbHost,
            dbPort: config.dbPort,
            dbName: config.dbName,
            webProtocol: config.webProtocol,
            webHost: config.webHost,
            webPort: config.webPort,
            adminDir: config.adminDir,
            publicDir: config.publicDir,
            webpageRoot: config.webpageRoot,
            adminApiRoot: config.adminApiRoot,
            publicApiRoot: config.publicApiRoot,
            sessionSecret: config.sessionSecret,
            webpackDevServer: config.webpackDevServer,
            webpackDevServerHost: config.webpackDevServerHost,
            webpackDevServerPort: config.webpackDevServerPort,
            staticPath: config.staticPath
        });
    }
}

export default WeblogJS;