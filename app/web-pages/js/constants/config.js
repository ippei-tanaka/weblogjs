import WEBLOG_ENV from '../../../../env-variables';

const SERVER_MODE =  WEBLOG_ENV.mode === 'development' || WEBLOG_ENV.mode === 'production';
const WEB_PORT = WEBLOG_ENV.web_port;

export const ADMIN_DIR = '/admin';
export const API_PATH = SERVER_MODE ? WEBLOG_ENV.public_api_root : WEBLOG_ENV.admin_api_root;
export const URL_BASE = `http://localhost:${WEB_PORT}`;