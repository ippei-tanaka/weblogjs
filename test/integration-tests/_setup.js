import {mongoDriver} from 'simple-odm';
import {settings, admin} from './_data';
import httpRequest from '../http-request';

const rootPath = process.env.NODE_ENV === "production" ? '../../lib' : '../../src';

export const weblogjs = require(`${rootPath}/app`);

const config = require(`${rootPath}/config`);

weblogjs.init(settings);

const {dbName, webHost, webPort, adminApiRoot} = config.getValues();

mongoDriver.setUp({
    database: dbName
});

export const ADMIN_URL = `http://${webHost}:${webPort}${adminApiRoot}`;
export const login = () => httpRequest.post(`${ADMIN_URL}/login`, admin);
export const logout = () => httpRequest.get(`${ADMIN_URL}/logout`);
