const WEBLOG_ENV = process.env && typeof process.env.WEBLOG_ENV === 'string' ? process.env.WEBLOG_ENV : "{}";
const str = WEBLOG_ENV.replace(/\^/g, '"');
const json = JSON.parse(str);

const defaultJson = {
    mode: null,
    db_host: "localhost",
    db_port: 27017,
    db_name: "weblogjs",
    web_host: "localhost",
    web_port: 80,
    webpage_root: "/",
    admin_api_root: "/api",
    public_api_root: "/public-api",
    session_secret: "huahui155HOUDSDe21"
};

export default Object.assign({}, defaultJson, json);