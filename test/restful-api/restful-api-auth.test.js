import configFile from '../config.json';
import WeblogJS from '../..';
import co from 'co';
import { expect } from 'chai';
import testData from './test-data.json';
import httpRequest from '../../utils/http-request';


var weblogjs = WeblogJS(configFile);
var config = weblogjs.config;
var admin = Object.freeze(Object.assign({
    email: config.admin_email,
    password: config.admin_password
}));
var testUser = Object.freeze(Object.assign(testData["valid-users"][0]));
const BASE_URL = `http://${config.web_server_host}:${config.web_server_port}${config.restful_api_root}`;


var clearDb = () => {
    return weblogjs.api.db.dropCollections()
        .catch(() => {
            //console.error(err);
        });
};



describe('Restful API Auth', () => {

    before(clearDb);
    before(() => weblogjs.web.startServer());
    beforeEach(clearDb);
    beforeEach(() => weblogjs.api.userManager.createAdminUser());
    after(() => weblogjs.web.stopServer());

    describe('/', () => {

        it('should return an empty object', (done) => {
            co(function* () {
                yield httpRequest.get(`${BASE_URL}/`, testUser);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });
    });

    describe('/login & logout', () => {

        it('should let the user log in', (done) => {
            co(function* () {
                yield httpRequest.post(`${BASE_URL}/login`, admin); // Login
                yield httpRequest.get(`${BASE_URL}/users`); // This request should be okay.
                yield httpRequest.get(`${BASE_URL}/logout`); // Logout
                yield httpRequest.get(`${BASE_URL}/users`); // This request should fail.
                done(new Error());
            }).catch(() => {
                done();
            });
        });
    });
});
