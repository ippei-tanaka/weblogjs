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
        return weblogjs
            .dbClear()
            .catch((err) => {
                //console.error(err);
            });
    };

    before(clearDb);
    before(() => weblogjs.startServer());
    afterEach(clearDb);
}


describe('/users', () => {

    it('should create a new user', (done) => {
        httpRequest.post(`${BASE_URL}/users`, testUser, testUser.email, testUser.password)
            .then((user) => {
                expect(user["_id"]).to.be.string;
                expect(user["email"]).to.equal(testUser["email"]);
                expect(user).to.not.have.property('password');
                expect(user["display-name"]).to.equal(testUser["display-name"]);
                done();
            })
            .catch(() => {
                done(new Error());
            });
    });

    /*
    it('should not create a new user without credential', (done) => {
        httpRequest.post(`${BASE_URL}/users`, testUser)
            .catch((err) => {
                console.log(err);
                done();
            });
    });
    */

    it('should return a list of users', (done) => {
        httpRequest.get(`${BASE_URL}/users`, testUser, testUser.email, testUser.password)
            .then((users) => {
                expect(users.users.length).to.equal(0);
                done();
            })
            .catch(() => {
                done(new Error());
            });
    });

});
