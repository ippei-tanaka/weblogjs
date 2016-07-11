const ENV = process.env.WEBLOG_WEBPACK_ENV || {};
const WEBPACK_MODE = Object.keys(ENV).length > 0;

export const PUBLIC_DIR = ENV.webpageRootForPublic;
export const PUBLIC_API_PATH = ENV.publicApiRoot;
export const URL_BASE = WEBPACK_MODE ? "" : `http://${ENV.web_host}:${ENV.web_port}`;