"use strict";

var settings = require('./settings.json');
var testData = require('./test-data.json');
var weblogjs = require('../')(settings);
var httpRequest = require('./utils/http-request');
var expect = require('chai').expect;

var admin = Object.freeze(Object.assign({
    email: settings.admin_email,
    password: settings.admin_password
}));
var testUser = Object.freeze(Object.assign(testData["valid-users"][0]));

const BASE_URL = "http://localhost:8080";

{
    let clearDb = () => {
        return weblogjs
            .dbClear()
            .catch(() => {
                //console.error(err);
            });
    };

    beforeEach(clearDb);
    beforeEach(() => weblogjs.startServer());
    afterEach(() => weblogjs.stopServer());
}


describe('/users', () => {

    it('should create a new user', (done) => {
        httpRequest.post(`${BASE_URL}/users`, testUser, admin.email, admin.password)
            .then((user) => {
                expect(user["_id"]).to.be.string;
                expect(user["email"]).to.equal(testUser["email"]);
                expect(user).to.not.have.property('password');
                expect(user["display-name"]).to.equal(testUser["display-name"]);
                done();
            })
            .catch((err) => {
                done(new Error(err));
            });
    });

    it('should not create a new user without credential', (done) => {
        httpRequest.post(`${BASE_URL}/users`, testUser)
            .catch(() => {
                done();
            });
    });

    it('should return a list of users', (done) => {
        httpRequest.get(`${BASE_URL}/users`, testUser, admin.email, admin.password)
            .then((users) => {
                expect(users.users.length).to.equal(1);
                done();
            })
            .catch((err) => {
                done(new Error(err));
            });
    });

});
