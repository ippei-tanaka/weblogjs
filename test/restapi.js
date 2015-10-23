"use strict";

var settings = require('./settings.json');
var testData = require('./test-data.json');
var weblogjs = require('../')(settings);
var httpRequest = require('./utils/http-request');
var expect = require('chai').expect;

var testUser = Object.freeze(Object.assign(testData["valid-users"][0]));

const BASE_URL = "http://localhost:8080";

{
    let clearDb = () => {
        return weblogjs.db
            .clear()
            .catch(() => {
            });
    };

    before(clearDb);
    before(() => weblogjs.server.start());
    afterEach(clearDb);
}


describe('/users', () => {

    it('should create a new user', (done) => {
        httpRequest.post(`${BASE_URL}/users`, testUser, testUser.email, testUser.password)
            .then(() => {
                done();
            })
            .catch(done);
    });

});
