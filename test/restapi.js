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

    before(clearDb);
    before(() => weblogjs.startServer());
    beforeEach(clearDb);
    beforeEach(() => weblogjs.createAdminUser());
    after(() => weblogjs.stopServer());
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
                console.error(err);
                done(new Error());
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
        httpRequest.get(`${BASE_URL}/users`, null, admin.email, admin.password)
            .then((obj) => {
                expect(obj.items.length).to.equal(1);
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });

    it('should update a user', (done) => {
        var testUser2 = Object.freeze(Object.assign(testData["valid-users"][1]));

        httpRequest.post(`${BASE_URL}/users`, testUser, admin.email, admin.password)
            .then((user) => {
                return httpRequest.put(`${BASE_URL}/users/${user._id}`, testUser2, testUser.email, testUser.password)
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/users?sort=created+desc`, null, testUser2.email, testUser2.password)
            })
            .then((obj) => {
                var user = obj.items[0];
                expect(obj.items.length).to.equal(2);
                expect(user["_id"]).to.be.string;
                expect(user["email"]).to.equal(testUser2.email);
                expect(user).to.not.have.property('password');
                expect(user["display_name"]).to.equal(testUser2.display_name);
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
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
                console.error(err);
                done(new Error());
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
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug + "-2");
                return httpRequest.post(`${BASE_URL}/categories`, categoryWithoutSlug, admin.email, admin.password)
            })
            .then((category) => {
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug + "-3");
                return httpRequest.post(`${BASE_URL}/categories`, { name: testCategory.name, "slug" : testCategory.slug + "-2" }, admin.email, admin.password)
            })
            .then((category) => {
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug + "-4");
                return httpRequest.post(`${BASE_URL}/categories`, { name: testCategory.name, "slug" : testCategory.slug + "-02" }, admin.email, admin.password)
            })
            .then((category) => {
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug + "-02");
                return httpRequest.post(`${BASE_URL}/categories`, categoryWithoutSlug, admin.email, admin.password)
            })
            .then((category) => {
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug + "-5");
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });

    it('should return a list of categories', (done) => {
        httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            .then(() => {
                return httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            })
            .then(() => {
                return httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/categories`, null, admin.email, admin.password)
            })
            .then((obj) => {
                expect(obj.categories).to.have.length(3);
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });

    it('should return a category', (done) => {
        httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            .then((category) => {
                return httpRequest.get(`${BASE_URL}/categories/${category._id}`, null, admin.email, admin.password)
            })
            .then((category) => {
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug);
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });

    it('should update a category', (done) => {
        httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            .then(() => {
                return httpRequest.get(`${BASE_URL}/categories`, null, admin.email, admin.password)
            })
            .then((obj) => {
                expect(obj.categories).to.have.length(1);
                expect(obj.categories[0].name).to.equal(testCategory.name);
                expect(obj.categories[0].slug).to.equal(testCategory.slug);
                return httpRequest.put(`${BASE_URL}/categories/${obj.categories[0]._id}`, { name: "Hello World", slug: "hello-world" }, admin.email, admin.password)
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/categories`, null, admin.email, admin.password)
            })
            .then((obj) => {
                expect(obj.categories).to.have.length(1);
                expect(obj.categories[0].name).to.equal("Hello World");
                expect(obj.categories[0].slug).to.equal("hello-world");
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });

    it('should delete a category', (done) => {
        httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            .then(() => {
                return httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/categories`, null, admin.email, admin.password)
            })
            .then((obj) => {
                expect(obj.categories).to.have.length(2);
                return httpRequest.del(`${BASE_URL}/categories/${obj.categories[0]._id}`, null, admin.email, admin.password)
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/categories`, null, admin.email, admin.password)
            })
            .then((obj) => {
                expect(obj.categories).to.have.length(1);
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });
});

describe('/posts', () => {

    it('should create a new post', (done) => {
        httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            .then(() => {
                return httpRequest.post(`${BASE_URL}/posts`, testPost, admin.email, admin.password)
            })
            .then((post) => {
                expect(post._id).to.be.string;
                done();
            })
            .catch(() => {
                done(new Error());
            });
    });

});
