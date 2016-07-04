import path from 'path';

const variables = {};

const defaultVariables = {
    mode: null,
    db_host: "localhost",
    db_port: 27017,
    db_name: "weblogjs",
    web_host: "localhost",
    web_port: 80,
    webpage_root: "/",
    admin_dir: "admin",
    public_dir: "",
    static_path: path.resolve(__dirname, "./client/static"),
    admin_api_root: "/api",
    public_api_root: "/public-api",
    session_secret: "huahui155HOUDSDe21",
    webpack_server_host: null,
    webpack_server_port: null
};

export const setEnv = (_variables) => {
    for (let key of Object.keys(_variables)) {
        if (defaultVariables.hasOwnProperty(key)) {
            variables[key] = _variables[key];
        }
    }
};

export const getEnv = () => Object.assign({}, defaultVariables, variables);