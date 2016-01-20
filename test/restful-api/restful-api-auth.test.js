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
    afterEach(() => {
        return httpRequest.get(`${BASE_URL}/logout`).catch(() => {});
    });
    after(() => weblogjs.web.stopServer());

    describe('/', () => {

        it('should return an empty object without login', (done) => {
            co(function* () {
                yield httpRequest.get(`${BASE_URL}/`, testUser);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });
    });

    describe('/login', () => {

        it('should give a 401 error if the user try to retrieve restricted data when they haven\'t logged in', (done) => {
            co(function* () {
                yield httpRequest.get(`${BASE_URL}/users`);
                done(new Error());
            }).catch(data => {
                expect(data.response.statusCode).to.equal(401);
                done();
            });
        });

        it('should let the user log in', (done) => {
            co(function* () {
                yield httpRequest.post(`${BASE_URL}/login`, admin); // Login
                done();
            }).catch(err => {
                console.error(err);
                done(new Error());
            });
        });

        it('should let the user retrieve data if the user has logged in', (done) => {
            co(function* () {
                yield httpRequest.post(`${BASE_URL}/login`, admin);
                yield httpRequest.get(`${BASE_URL}/users`);
                done();
            }).catch(err => {
                console.error(err);
                done(new Error());
            });
        });

        it('should not let the user log in if the credential is invalid', (done) => {
            co(function* () {
                yield httpRequest.post(`${BASE_URL}/login`, { email: "wrong@address.com", password: "invalidpass" }); // Login
                yield httpRequest.get(`${BASE_URL}/users`); // This request should be okay.
                done(new Error());
            }).catch(data => {
                expect(data.response.statusCode).to.equal(401);
                done();
            });
        });
    });
});
