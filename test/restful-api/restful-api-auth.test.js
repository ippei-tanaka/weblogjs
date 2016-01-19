"use strict";

var configFile = require('../config.json');
var testData = require('./test-data.json');
var weblogjs = require('../../')(configFile);
var httpRequest = require('../utils/http-request');
var config = weblogjs.config;
var admin = Object.freeze(Object.assign({
    email: config.admin_email,
    password: config.admin_password
}));
var testUser = Object.freeze(Object.assign(testData["valid-users"][0]));
const BASE_URL = `http://${config.web_server_host}:${config.web_server_port}/api/v${config.api_version}`;



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

            httpRequest.get(`${BASE_URL}/`, testUser)
                .then(() => {
                    done();
                })
                .catch((err) => {
                    console.error(err);
                    done(new Error());
                });
        });
    });

    describe('/login & logout', () => {

        it('should let the user log in', (done) => {

            httpRequest.post(`${BASE_URL}/login`, admin) // Login
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/users`); // This request should be okay.
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/logout`); // Logout
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/users`); // This request should fail.
                })
                .catch(() => {
                    done();
                });
        });
    });
});
