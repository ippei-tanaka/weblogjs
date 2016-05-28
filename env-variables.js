let ENV = process.env.WEBLOG_ENV || process.env.WEBLOG_WEBPACK_ENV;

if (typeof ENV === 'string') {
    ENV = JSON.parse(ENV.replace(/\^/g, '"'));
}

const defaultVariables = {
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

export default Object.assign({}, defaultVariables, ENV);