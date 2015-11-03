"use strict";

var config = require('./config.json');
var testData = require('./test-data.json');
var weblogjs = require('../')(config);
var httpRequest = require('./utils/http-request');
var expect = require('chai').expect;

var admin = Object.freeze(Object.assign({
    email: config.admin_email,
    password: config.admin_password
}));

var testUser = Object.freeze(Object.assign(testData["valid-users"][0]));

var testCategory = Object.freeze(Object.assign(testData["valid-categories"][0]));

const BASE_URL = "http://localhost:8080/api/v1";

{
    let clearDb = () => {
        return weblogjs.api.db.dropCollections()
            .catch(() => {
                //console.error(err);
            });
    };

    before(clearDb);
    before(() => weblogjs.web.startServer());
    beforeEach(clearDb);
    beforeEach(() => weblogjs.web.createAdminUser());
    after(() => weblogjs.web.stopServer());
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
            .then((user) => {
                expect(user).to.be.null;
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
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
                expect(obj.items).to.have.length(3);
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
                expect(obj.items).to.have.length(1);
                expect(obj.items[0].name).to.equal(testCategory.name);
                expect(obj.items[0].slug).to.equal(testCategory.slug);
                return httpRequest.put(`${BASE_URL}/categories/${obj.items[0]._id}`, { name: "Hello World", slug: "hello-world" }, admin.email, admin.password)
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/categories`, null, admin.email, admin.password)
            })
            .then((obj) => {
                expect(obj.items).to.have.length(1);
                expect(obj.items[0].name).to.equal("Hello World");
                expect(obj.items[0].slug).to.equal("hello-world");
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
                expect(obj.items).to.have.length(2);
                return httpRequest.del(`${BASE_URL}/categories/${obj.items[0]._id}`, null, admin.email, admin.password)
            })
            .then(() => {
                return httpRequest.get(`${BASE_URL}/categories`, null, admin.email, admin.password)
            })
            .then((obj) => {
                expect(obj.items).to.have.length(1);
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });
});

describe('/posts', () => {

    var testPost1 = {
        "title": " ## My Post Title! ",
        "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
        "category": testCategory.slug,
        "tags": ["tag1", "tag2"]
    };

    var testPost2 = {
        "title": "It is - the  title 1 --- ",
        "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
        "category": undefined
    };

    it('should create a new post', (done) => {
        var category;

        httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password)
            .then((_category) => {
                category = _category;
                return httpRequest.post(`${BASE_URL}/posts`, testPost1, admin.email, admin.password);
            })
            .then((post) => {
                expect(post._id).to.be.string;
                expect(post.title).to.equal(testPost1.title);
                expect(post.slug).to.equal("my-post-title");
                expect(post.content).to.equal(testPost1.content);
                expect(post.tags).to.include("tag1");
                expect(post.tags).to.include("tag2");
                return httpRequest.post(`${BASE_URL}/posts`, testPost1, admin.email, admin.password);
            })
            .then((post) => {
                expect(post._id).to.be.string;
                expect(post.title).to.equal(testPost1.title);
                expect(post.slug).to.equal("my-post-title-2");
                expect(post.content).to.equal(testPost1.content);
                expect(post.tags).to.include("tag1");
                expect(post.tags).to.include("tag2");

                testPost2.category = category._id;

                return httpRequest.post(`${BASE_URL}/posts`, testPost2, admin.email, admin.password);
            })
            .then((post) => {
                expect(post._id).to.be.string;
                expect(post.title).to.equal(testPost2.title);
                expect(post.slug).to.equal("it-is-the-title-1");
                expect(post.content).to.equal(testPost2.content);

                return httpRequest.post(`${BASE_URL}/posts`, testPost2, admin.email, admin.password);
            })
            .then((post) => {
                expect(post._id).to.be.string;
                expect(post.title).to.equal(testPost2.title);
                expect(post.slug).to.equal("it-is-the-title-2");
                expect(post.content).to.equal(testPost2.content);
                done();
            })
            .catch((err) => {
                console.error(err);
                done(new Error());
            });
    });

    /*
    it('should get a list of posts', (done) => {
        Promise.resolve()
            .then(() => {
                return httpRequest.post(`${BASE_URL}/categories`, testCategory, admin.email, admin.password);
            })
            .then(() => {
                return httpRequest.post(`${BASE_URL}/post`, testPost1, admin.email, admin.password);
            });

    });
    */

});
