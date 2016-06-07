import { getEnv } from '../../../../env-variables';

export default process.env.WEBLOG_WEBPACK_ENV || getEnv();
