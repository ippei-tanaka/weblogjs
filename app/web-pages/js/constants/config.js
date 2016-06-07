import ENV from './env';

export const ADMIN_DIR = '/admin';
export const PUBLIC_API_PATH = ENV.public_api_root;
export const ADMIN_API_PATH = ENV.admin_api_root;
export const URL_BASE = `http://localhost:${ENV.web_port}`;
export const PostsPerPageList = Object.freeze([1, 2, 3, 5, 10, 15]);