import WEBLOG_ENV from '../../../../env-variables';

const WEB_PORT = WEBLOG_ENV.web_port;

export const ADMIN_DIR = '/admin';
export const PUBLIC_API_PATH = WEBLOG_ENV.public_api_root;
export const ADMIN_API_PATH = WEBLOG_ENV.admin_api_root;
export const URL_BASE = `http://localhost:${WEB_PORT}`;