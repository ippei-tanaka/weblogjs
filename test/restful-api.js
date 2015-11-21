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

describe('Restful API', () => {

    var clearDb = () => {
        return weblogjs.api.db.dropCollections()
            .catch(() => {
                //console.error(err);
            });
    };

    before(clearDb);
    before(() => weblogjs.web.startServer());
    beforeEach(clearDb);
    beforeEach(() => weblogjs.api.userManager.createAdminUser());
    beforeEach(() => httpRequest.post(`${BASE_URL}/login`, admin));
    afterEach(() => httpRequest.get(`${BASE_URL}/logout`));
    after(() => weblogjs.web.stopServer());

    describe('/users', () => {

        it('should create a new user', (done) => {

            httpRequest.post(`${BASE_URL}/users`, testUser)
                .then((user) => {
                    expect(user["_id"]).to.be.string;
                    expect(user["email"]).to.equal(testUser["email"]);
                    expect(user).to.not.have.property('password');
                    expect(user["display_name"]).to.equal(testUser["display_name"]);
                    done();
                })
                .catch((err) => {
                    console.error(err);

                });
        });

        it('should return error messages when failing to create a new user', (done) => {

            httpRequest.post(`${BASE_URL}/users`, {
                "email": "wrongemail",
                "password": "aaa",
                "display_name": ""
            })
                .then(() => {
                    done(new Error());
                })
                .catch((err) => {
                    var errors = err.body.errors;

                    expect(errors["email"].message).to.equal("It is not a valid email address.");
                    expect(errors["password"].message).to.equal("A password should be between 8 and 16 characters.");
                    expect(errors["display_name"].message).to.equal("A display name is required.");

                    return httpRequest.post(`${BASE_URL}/users`, testUser);
                })
                .then(() => {
                    return httpRequest.post(`${BASE_URL}/users`, testUser);
                })
                .catch((err) => {
                    var errors = err.body.errors;

                    expect(errors["email"].message).to.equal(`The email, "${testUser.email}", has been registered.`);

                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should not create a new user when the email has already been registered', (done) => {
            httpRequest.post(`${BASE_URL}/users`, testUser)
                .then(() => {
                    return httpRequest.post(`${BASE_URL}/users`, testUser);
                })
                .catch(() => {
                    done();
                });
        });

        it('should return a list of users', (done) => {
            httpRequest.get(`${BASE_URL}/users`)
                .then((obj) => {
                    expect(obj.items.length).to.equal(1);
                    done();
                })
                .catch((err) => {
                    console.error(err);
                    done(new Error());
                });
        });

        it('should return a user, "me"', (done) => {
            httpRequest.get(`${BASE_URL}/users/me`)
                .then((user) => {
                    expect(user["_id"]).to.be.string;
                    expect(user["email"]).to.equal(admin["email"]);
                    expect(user).to.not.have.property('password');
                    done();
                })
                .catch((err) => {
                    console.error(err);
                    done(new Error());
                });
        });

        it('should update a user', (done) => {
            var testUserUpdated = Object.assign({}, testUser);
            testUserUpdated.display_name = "Yamako Tanaka";
            testUserUpdated.password = "testest2test";

            httpRequest.post(`${BASE_URL}/users`, testUser)
                .then((user) => {
                    return httpRequest.put(`${BASE_URL}/users/${user._id}`, testUserUpdated)
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/users?sort=created+desc`)
                })
                .then((obj) => {
                    var user = obj.items[0];
                    expect(obj.items.length).to.equal(2);
                    expect(user["_id"]).to.be.string;
                    expect(user["email"]).to.equal(testUserUpdated.email);
                    expect(user).to.not.have.property('password');
                    expect(user["display_name"]).to.equal(testUserUpdated.display_name);
                    done();
                })
                .catch((err) => {
                    console.error(err);
                    done(new Error());
                });
        });

        it('should return a user and delete a user', (done) => {
            var createdUser;
            httpRequest.post(`${BASE_URL}/users`, testUser)
                .then((user) => {
                    createdUser = user;
                    return httpRequest.get(`${BASE_URL}/users/${createdUser._id}`);
                })
                .then(() => {
                    return httpRequest.del(`${BASE_URL}/users/${createdUser._id}`);
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/users/${createdUser._id}`);
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
            httpRequest.post(`${BASE_URL}/categories`, testCategory)
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

            var cat1 = {
                name: 'Category Name',
                slug: 'cat-name-_'
            };

            var cat2 = {
                name: 'Category Name',
                slug: '!@%name-_'
            };

            httpRequest.post(`${BASE_URL}/categories`, cat1)
                .then((category) => {
                    expect(category._id).to.be.string;
                    expect(category.name).to.equal(cat1.name);
                    expect(category.slug).to.equal(cat1.slug);
                    return httpRequest.post(`${BASE_URL}/categories`, cat2)
                })
                .then((category) => {
                    expect(category.name).to.equal(cat2.name);
                    expect(category.slug).to.equal(cat2.slug);
                    done();
                })
                .catch((err) => {
                    console.error(err);
                    done(new Error());
                });
        });

        it('should not create a new category when the slug is duplicated', (done) => {

            var cat1 = {
                name: 'Category Name',
                slug: 'my0slug1'
            };

            var cat2 = {
                name: 'Rondom Name',
                slug: 'my0slug1'
            };

            httpRequest.post(`${BASE_URL}/categories`, cat1)
                .then((category) => {
                    expect(category._id).to.be.string;
                    expect(category.name).to.equal(cat1.name);
                    expect(category.slug).to.equal(cat1.slug);
                    return httpRequest.post(`${BASE_URL}/categories`, cat2)
                })
                .then(() => {
                    done(new Error());
                })
                .catch(() => {
                    done();
                });
        });

        it('should return a list of categories', (done) => {

            var cat1 = {
                name: 'Category Name',
                slug: 'my0slug1'
            };

            var cat2 = {
                name: 'Rondom Name',
                slug: 'dsf324'
            };

            var cat3 = {
                name: 'AS Name',
                slug: 'gdfsg'
            };


            httpRequest.post(`${BASE_URL}/categories`, cat1)
                .then(() => {
                    return httpRequest.post(`${BASE_URL}/categories`, cat2)
                })
                .then(() => {
                    return httpRequest.post(`${BASE_URL}/categories`, cat3)
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/categories`)
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
            httpRequest.post(`${BASE_URL}/categories`, testCategory)
                .then((category) => {
                    return httpRequest.get(`${BASE_URL}/categories/${category._id}`)
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
            httpRequest.post(`${BASE_URL}/categories`, testCategory)
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/categories`, null)
                })
                .then((obj) => {
                    expect(obj.items).to.have.length(1);
                    expect(obj.items[0].name).to.equal(testCategory.name);
                    expect(obj.items[0].slug).to.equal(testCategory.slug);
                    return httpRequest.put(`${BASE_URL}/categories/${obj.items[0]._id}`, {
                        name: "Hello World",
                        slug: "hello-world"
                    })
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/categories`, null)
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

            var cat1 = {
                name: 'Category Name',
                slug: 'my0slug1'
            };

            var cat2 = {
                name: 'Rondom Name',
                slug: 'dsf324'
            };

            httpRequest.post(`${BASE_URL}/categories`, cat1)
                .then(() => {
                    return httpRequest.post(`${BASE_URL}/categories`, cat2)
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/categories`)
                })
                .then((obj) => {
                    expect(obj.items).to.have.length(2);
                    return httpRequest.del(`${BASE_URL}/categories/${obj.items[0]._id}`)
                })
                .then(() => {
                    return httpRequest.get(`${BASE_URL}/categories`)
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

        it('should create a new post', (done) => {
            var category;

            var testPost1 = {
                "title": " ## My Post Title! ",
                "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
                "category": testCategory.slug,
                "slug": "testtset",
                "tags": ["tag1", "tag2"]
            };

            var testPost2 = {
                "title": "It is - the  title 1 --- ",
                "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
                "slug": "3fasd3ea",
                "category": undefined
            };

            httpRequest.post(`${BASE_URL}/categories`, testCategory)
                .then((_category) => {
                    category = _category;
                    return httpRequest.get(`${BASE_URL}/users/me`);
                })
                .then((_user) => {
                    testPost1.author = _user._id;
                    testPost2.author = _user._id;
                    return httpRequest.post(`${BASE_URL}/posts`, testPost1);
                })
                .then((post) => {
                    expect(post._id).to.be.string;
                    expect(post.title).to.equal(testPost1.title);
                    expect(post.slug).to.equal(testPost1.slug);
                    expect(post.content).to.equal(testPost1.content);
                    expect(post.tags).to.include("tag1");
                    expect(post.tags).to.include("tag2");
                    return httpRequest.post(`${BASE_URL}/posts`, testPost2);
                })
                .then((post) => {
                    expect(post._id).to.be.string;
                    expect(post.title).to.equal(testPost2.title);
                    expect(post.slug).to.equal(testPost2.slug);
                    expect(post.content).to.equal(testPost2.content);
                    done();
                })
                .catch((err) => {
                    console.error(err);
                    done(new Error());
                });
        });
        /*
        it('should update a post', (done) => {
            var category;

            var testPost = {
                "title": " ## My Post Title! ",
                "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
                "category": testCategory.slug,
                "tags": ["tag1", "tag2"]
            };

            httpRequest.post(`${BASE_URL}/categories`, testCategory)
                .then((_category) => {
                    category = _category;
                    return httpRequest.get(`${BASE_URL}/users/me`);
                })
                .then((_user) => {
                    testPost.author = _user._id;
                    return httpRequest.post(`${BASE_URL}/posts`, testPost);
                })
                .then((post) => {
                    var update = {
                        "title" : "A B C D E"
                    };
                    return httpRequest.put(`${BASE_URL}/posts/${post._id}`, update);
                })
                .then((post) => {
                    expect(post._id).to.be.string;
                    expect(post.title).to.equal("A B C D E");
                    expect(post.slug).to.equal("my-post-title");
                    expect(post.content).to.equal(testPost.content);
                    expect(post.tags).to.include("tag1");
                    expect(post.tags).to.include("tag2");
                    testPost.category = category._id;
                    done();
                })
                .catch((err) => {
                    console.error(err);
                    done(new Error());
                });
        });
        */

    });
});
