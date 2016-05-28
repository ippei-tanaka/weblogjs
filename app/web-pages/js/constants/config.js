const WEBSERVER_PORT = process.env.WB_WSERVER_PORT;
const INTERNAL_WEBSERVER_PORT = process.env.WB_INTN_WSERVER_PORT;
const SERVER_MODE = process.env.WEBLOG_ENV === 'development' || process.env.WEBLOG_ENV === 'production';
const PORT = SERVER_MODE ? INTERNAL_WEBSERVER_PORT : WEBSERVER_PORT;

export const ADMIN_DIR = '/admin';
export const URL_BASE = `http://localhost:${PORT}`;