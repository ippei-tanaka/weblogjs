import { getEnv } from '../../env-variables';
import path from 'path';

const ENV = process.env.WEBLOG_WEBPACK_ENV || getEnv();
const WEBPACK_MODE = ENV.mode === 'webpack' || ENV.mode === 'webpack-dev-server';

export const ADMIN_DIR = path.resolve(ENV.webpage_root, ENV.admin_dir);
export const PUBLIC_API_PATH = ENV.public_api_root;
export const ADMIN_API_PATH = ENV.admin_api_root;
export const URL_BASE = WEBPACK_MODE ? "" : `http://${ENV.web_host}:${ENV.web_port}`;
export const PostsPerPageList = Object.freeze([1, 2, 3, 5, 10, 15]);