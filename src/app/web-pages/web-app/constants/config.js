import ENV from './env';

const WEBPACK_MODE = ENV.mode === 'webpack';

export const ADMIN_DIR = '/admin';
export const PUBLIC_API_PATH = ENV.public_api_root;
export const ADMIN_API_PATH = ENV.admin_api_root;
export const URL_BASE = WEBPACK_MODE ? "" : `http://localhost:${ENV.web_port}`;
export const PostsPerPageList = Object.freeze([1, 2, 3, 5, 10, 15]);