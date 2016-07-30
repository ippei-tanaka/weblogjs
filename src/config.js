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

    publicSiteRoot: "/",
    publicSiteStaticPaths: [],

    sessionSecret: "sdnIdjSe2AE2SADfD",

    adminEmail: "t@t.com",
    adminPassword: "tttttttt",
    adminDisplayName: "Admin",
    adminSlug: 'admin'
});

const config = Object.assign({}, initialConfig);

/*
Object.defineProperty(config, 'adminJsFileName', {
    get: function ()
    {
        return this.jsFileName.replace(/\[name]/g, this.adminFileNameBase);
    }
});
*/

const _exports = Object.freeze({

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

export default _exports;
module.exports = _exports;