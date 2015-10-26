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

var testPost = Object.freeze(Object.assign(testData["valid-posts"][0]));

var testCategory = Object.freeze(Object.assign(testData["valid-categories"][0]));

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
                expect(user["display_name"]).to.equal(testUser["display_name"]);
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

    it('should not create a new user when the email has already been registered', (done) => {
        httpRequest.post(`${BASE_URL}/users`, testUser, admin.email, admin.password)
            .then(() => {
                return httpRequest.post(`${BASE_URL}/users`, testUser, admin.email, admin.password);
            })
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

    it('should return a user and delete a user', (done) => {
        var createdUser;
        httpRequest.post(`${BASE_URL}/users`, testUser, admin.email, admin.password)
            .then((user) => {
                createdUser = user;
                return httpRequest.get(`${BASE_URL}/users/${createdUser._id}`, null, testUser.email, testUser.password);
            })
            .then(() => {
                return httpRequest.del(`${BASE_URL}/users/${createdUser._id}`, null, testUser.email, testUser.password);
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/users/${createdUser._id}`, null, admin.email, admin.password);
            })
            .catch(() => {
                done();
            });
    });

});


describe('/categories', () => {

    it('should create a new category', (done) => {
        var categoryWithoutSlug = {
            name: testCategory.name
        };

        httpRequest.post(`${BASE_URL}/categories`, categoryWithoutSlug, admin.email, admin.password)
            .then((category) => {
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug);
                done();
            })
            .catch((err) => {
                done(new Error(err));
            });
    });

    it('should create a new category even when the name is duplicated', (done) => {
        var categoryWithoutSlug = {
            name: testCategory.name
        };

        httpRequest.post(`${BASE_URL}/categories`, categoryWithoutSlug, admin.email, admin.password)
            .then((category) => {
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug);
                return httpRequest.post(`${BASE_URL}/categories`, categoryWithoutSlug, admin.email, admin.password)
            })
            .then((category) => {
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug + "2");
                done();
            })
            .catch((err) => {
                done(new Error(err));
            });
    });

});

/*
describe('/posts', () => {

    it('should create a new post', (done) => {
        httpRequest.post(`${BASE_URL}/posts`, testPost, admin.email, admin.password)
            .then((post) => {
                expect(post["_id"]).to.be.string;
                done();
            })
            .catch((err) => {
                done(new Error(err));
            });
    });

});
*/
