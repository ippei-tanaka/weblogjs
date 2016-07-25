const initialConfig = Object.freeze({
    dbHost: "localhost",
    dbPort: 27017,
    dbName: "weblogjs",

    webProtocol: "http",
    webHost: "localhost",
    webPort: 8080,

    adminApiRoot: "/admin-api",

    adminSiteRoot: "/admin",
    adminSiteStaticPaths: [],

    publicApiRoot: "/public-api",

    publicSiteRoot: "/",
    publicSiteStaticPaths: [],

    sessionSecret: "sdnIdjSe2AE2SADfD",

    adminEmail: "t@t.com",
    adminPassword: "tttttttt",
    adminDisplayName: "Admin",
    adminSlug: 'admin',

    defaultBlogName: "My Blog",
    defaultBlogSlug: "my-blog",
    defaultBlogPostPerPage: 1

    /*
    webpageRoot: "/",
    adminDir: "admin",
    publicDir: "",

    adminApiRoot: "/api",
    publicApiRoot: "/public-api",
    staticPath: null,


    webpackDevServer: false,
    webpackDevServerHost: "localhost",
    webpackDevServerPort: 3000,

    adminEntryFile: path.resolve(__dirname, "admin-app/browser-entry.js"),
    publicEntryFile: path.resolve(__dirname, "public-app/browser-entry.js"),
    envNamespace: 'WEBLOG_WEBPACK_ENV',
    bundleDirName: 'bundle',
    vendorJsFileName: 'vendor.js',
    cssFileName: '[name]-style.css',
    jsFileName: "[name].js",
    adminFileNameBase: 'admin',
    publicFileNameBase: 'public',
    nodeModuleDir: path.resolve(__dirname, "../node_modules"),

    themeDistDirName: 'themes',
    themeSrcDirPath: []
    */
});

const config = Object.assign({}, initialConfig);

/*
Object.defineProperty(config, 'adminJsFileName', {
    get: function ()
    {
        return this.jsFileName.replace(/\[name]/g, this.adminFileNameBase);
    }
});

Object.defineProperty(config, 'adminCssFileName', {
    get: function ()
    {
        return this.cssFileName.replace(/\[name]/g, this.adminFileNameBase);
    }
});

Object.defineProperty(config, 'publicJsFileName', {
    get: function ()
    {
        return this.jsFileName.replace(/\[name]/g, this.publicFileNameBase);
    }
});

Object.defineProperty(config, 'themeSrcDirPaths', {
    get: function ()
    {
        return this.themeSrcDirPath.concat([path.resolve(__dirname, "public-app/themes")])
    }
});
*/

export default Object.freeze({

    setValues: (values) =>
    {
        Object.assign(config, values);
    },

    getValues: () =>
    {
        const obj = {};

        for (const key of Object.getOwnPropertyNames(config))
        {
            obj[key] = config[key];
        }

        return obj;
    },

    getValue: (key) =>
    {
        return config[key];
    }
});