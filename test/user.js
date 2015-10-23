"use strict";

var settings = require('./settings.json');
var testData = require('./test-data.json');
var weblogjs = require('../')(settings);
var expect = require('chai').expect;


var testUser = Object.freeze(Object.assign(testData["valid-users"][0]));
var testBlog = Object.freeze(Object.assign(testData["valid-blogs"][0]));


{
    let clearDb = () => {
        return weblogjs.db
            .clear()
            .catch(() => {
            });
    };

    before(clearDb);
    afterEach(clearDb);
}


describe('weblogjs.user', () => {

    it('should create a new user', (done) => {
        weblogjs.user
            .create(testUser)
            .then((user) => {
                expect(user["email"]).to.equal(testUser["email"]);
                expect(user).to.not.have.property('password');
                expect(user["display-name"]).to.equal(testUser["display-name"]);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should not create a duplicated user', (done) => {
        weblogjs.user
            .create(testUser)
            .then(() => {
                return weblogjs.user.create(testUser);
            })
            .catch(() => {
                done();
            });
    });

    it('should let a user log in', (done) => {
        weblogjs.user
            .create(testUser)
            .then(() => {
                return weblogjs.user.isValid(testUser);
            })
            .then(() => {
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

});
