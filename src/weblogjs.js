import path from 'path';

const initialConfig = Object.freeze({
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
    staticPath: null,

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
    defaultBlogPostPerPage: 1,

    adminEntryFile: path.resolve(__dirname, "admin-app/browser-entry.js"),
    publicEntryFile: path.resolve(__dirname, "public-app/browser-entry.js"),
    envNamespace: 'WEBLOG_WEBPACK_ENV',
    bundleDirName: 'bundle',
    vendorJsFileName: 'vendor.js',
    cssFileName: '[name]-style.css',
    jsFileName: "[name].js",
    adminFileNameBase: 'admin',
    publicFileNameBase: 'public',
    nodeModuleDir: path.resolve(__dirname, "../node_modules")
});

const config = Object.assign({}, initialConfig);

Object.defineProperty(config, 'adminJsFileName', {
    get: function () {
        return this.jsFileName.replace(/\[name]/g, this.adminFileNameBase);
    }
});

Object.defineProperty(config, 'adminCssFileName', {
    get: function () {
        return this.cssFileName.replace(/\[name]/g, this.adminFileNameBase);
    }
});

Object.defineProperty(config, 'publicJsFileName', {
    get: function () {
        return this.jsFileName.replace(/\[name]/g, this.publicFileNameBase);
    }
});

Object.defineProperty(config, 'publicCssFileName', {
    get: function () {
        return this.cssFileName.replace(/\[name]/g, this.publicFileNameBase);
    }
});

class WeblogJS {

    static setConfig (value)
    {
        Object.assign(config, value);
    }

    static getConfig ()
    {
        const obj = {};

        for (const key of Object.getOwnPropertyNames(config)) {
            obj[key] = config[key];
        }

        return obj;
    }

    static createAdmin ()
    {
        const dbRunner = require('./runners/db-runner').default;

        console.log(`Creating the admin user: ${config.adminDisplayName}...\n`);

        return dbRunner.createAdminUser(this.getConfig()).then(() =>
        {
            console.log(`Completed creating the admin user: ${config.adminDisplayName}.\n`);
        });
    }

    static createDefaultBlog ()
    {
        const dbRunner = require('./runners/db-runner').default;

        console.log(`Creating the default blog: ${config.defaultBlogName}...\n`);

        return dbRunner.createDefaultBlog(this.getConfig()).then(() =>
        {
            console.log(`Complete creating the default blog: ${config.defaultBlogName}.\n`);
        });
    }

    static dropDatabase ()
    {
        const dbRunner = require('./runners/db-runner').default;

        console.log(`Dropping the database: ${config.dbName}...\n`);

        return dbRunner.dropDatabase(this.getConfig()).then(() =>
        {
            console.log(`Completed dropping the database: ${config.dbName}.\n`);
        });
    }

    static removeAllDocuments ()
    {
        const dbRunner = require('./runners/db-runner').default;

        console.log("Removing all documents...\n");

        return dbRunner.removeAllDocuments(this.getConfig()).then(() =>
        {
            console.log("Completed removing all documents.\n");
        });
    }

    static buildBrowserEntryFiles ()
    {
        const webpackRunner = require('./runners/webpack-runner').default;

        console.log("Building client entry files...\n");

        return webpackRunner.build(this.getConfig()).then(() =>
        {
            console.log("Completed building client entry files.\n");
        });
    }

    static startBrowserEntryFileServer ()
    {
        const webpackDevServerRunner = require('./runners/webpack-dev-server-runner').default;

        console.log("Starting Webpack Dev Server...\n");

        return webpackDevServerRunner.start(this.getConfig()).then(() =>
        {
            console.log("Completed starting Webpack Dev Server.\n");
        });
    }

    static startWebServer ()
    {
        const webServerRunner = require('./runners/web-server-runner').default;

        console.log("Starting a web server...\n");

        return webServerRunner.start(this.getConfig()).then(() =>
        {
            const config = this.getConfig();
            console.log("Completed starting the web server.\n");
            console.log(`Go to the public page: ${config.webProtocol}://${config.webHost}:${config.webPort}/${config.publicDir}`);
            console.log(`Or, go to the admin page: ${config.webProtocol}://${config.webHost}:${config.webPort}/${config.adminDir}\n`);
        });
    }
}

export default WeblogJS;