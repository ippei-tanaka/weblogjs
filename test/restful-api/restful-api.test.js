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
var testCategory = Object.freeze(Object.assign(testData["valid-categories"][0]));
const BASE_URL = `http://${config.web_server_host}:${config.web_server_port}${config.restful_api_root}`;


var clearDb = () => {
    return weblogjs.api.db.dropCollections()
        .catch(() => {
            //console.error(err);
        });
};


describe('Restful API', () => {


    before(clearDb);
    before(() => weblogjs.web.startServer());
    beforeEach(clearDb);
    beforeEach(() => weblogjs.api.userManager.createAdminUser());
    beforeEach(() => httpRequest.post(`${BASE_URL}/login`, admin));
    afterEach(() => httpRequest.get(`${BASE_URL}/logout`));
    after(clearDb);
    after(() => weblogjs.web.stopServer());

    describe('/users', () => {

        it('should create a new user', (done) => {
            co(function* () {
                var user = yield httpRequest.post(`${BASE_URL}/users`, testUser);

                expect(user["_id"]).to.be.string;
                expect(user["email"]).to.equal(testUser["email"]);
                expect(user).to.not.have.property('password');
                expect(user["display_name"]).to.equal(testUser["display_name"]);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });

        it('should return error messages when failing to create a new user', (done) => {

            httpRequest.post(`${BASE_URL}/users`, {
                    "email": "wrongemail",
                    "password": "aaa",
                    "display_name": "",
                    "slug": ""
                })
                .then(() => {
                    done(new Error());
                })
                .catch((err) => {
                    var errors = err.body.errors;

                    expect(errors["email"].message).to.equal("It is not a valid email address.");
                    expect(errors["password"].message).to.equal("Password should be between 8 and 16 characters.");
                    expect(errors["display_name"].message).to.equal("Display Name is required.");
                    expect(errors["slug"].message).to.equal("Slug is required.");

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
                    console.error(err);
                    done(new Error());
                });
        });

        it('should not create a new user when the email has already been registered', (done) => {
            co(function* () {
                yield httpRequest.post(`${BASE_URL}/users`, testUser);
                yield httpRequest.post(`${BASE_URL}/users`, testUser);
            }).catch(() => {
                done();
            });
        });

        it('should return a list of users', (done) => {
            co(function* () {
                var data = yield httpRequest.get(`${BASE_URL}/users`);
                expect(data.items.length).to.equal(1);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            })
        });

        it('should return a user, "me"', (done) => {
            co(function* () {
                var user = yield httpRequest.get(`${BASE_URL}/users/me`);
                expect(user["_id"]).to.be.string;
                expect(user["email"]).to.equal(admin["email"]);
                expect(user).to.not.have.property('password');
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });

        it('should update a user', (done) => {
            var testUserUpdated = Object.assign({}, testUser);
            testUserUpdated.display_name = "Yamako Tanaka";
            testUserUpdated.password = "testest2test";

            co(function* () {
                var user1 = yield httpRequest.post(`${BASE_URL}/users`, testUser);
                yield httpRequest.put(`${BASE_URL}/users/${user1._id}`, testUserUpdated);
                var data = yield httpRequest.get(`${BASE_URL}/users?sort=created+-1,_id`);
                var user2 = data.items[0];
                expect(data.items.length).to.equal(2);
                expect(user2["_id"]).to.be.string;
                expect(user2["email"]).to.equal(testUserUpdated.email);
                expect(user2).to.not.have.property('password');
                expect(user2["display_name"]).to.equal(testUserUpdated.display_name);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });

        it('should return a user and delete a user', (done) => {
            co(function* () {
                var createdUser = yield httpRequest.post(`${BASE_URL}/users`, testUser);
                yield httpRequest.get(`${BASE_URL}/users/${createdUser._id}`);
                yield httpRequest.del(`${BASE_URL}/users/${createdUser._id}`);
                var user = yield httpRequest.get(`${BASE_URL}/users/${createdUser._id}`);
                expect(user).to.be.null;
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });
    });

    describe('/categories', () => {

        it('should create a new category', (done) => {
            co(function* () {
                var category = yield httpRequest.post(`${BASE_URL}/categories`, testCategory);
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug);
                done();
            }).catch((err) => {
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
                slug: 'name-_'
            };

            co(function* () {
                var retrievedCat1 = yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                var retrievedCat2 = yield httpRequest.post(`${BASE_URL}/categories`, cat2);

                expect(retrievedCat1._id).to.be.string;
                expect(retrievedCat1.name).to.equal(cat1.name);
                expect(retrievedCat1.slug).to.equal(cat1.slug);
                expect(retrievedCat2.name).to.equal(cat2.name);
                expect(retrievedCat2.slug).to.equal(cat2.slug);
                done();
            }).catch((err) => {
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

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                yield httpRequest.post(`${BASE_URL}/categories`, cat2);
                done(new Error());
            }).catch(() => {
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

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                yield httpRequest.post(`${BASE_URL}/categories`, cat2);
                yield httpRequest.post(`${BASE_URL}/categories`, cat3);
                var data = yield httpRequest.get(`${BASE_URL}/categories`);
                expect(data.items).to.have.length(3);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });

        it('should return a category', (done) => {
            co(function* () {
                var createdCategory = yield httpRequest.post(`${BASE_URL}/categories`, testCategory);
                var retreivedCategory = yield  httpRequest.get(`${BASE_URL}/categories/${createdCategory._id}`);
                expect(retreivedCategory._id).to.equal(createdCategory._id);
                expect(retreivedCategory.name).to.equal(testCategory.name);
                expect(retreivedCategory.slug).to.equal(testCategory.slug);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });

        it('should update a category', (done) => {
            co(function* () {
                yield httpRequest.post(`${BASE_URL}/categories`, testCategory);
                var data1 = yield httpRequest.get(`${BASE_URL}/categories`, null);
                yield httpRequest.put(`${BASE_URL}/categories/${data1.items[0]._id}`, {
                    name: "Hello World",
                    slug: "hello-world"
                });
                var data2 = yield httpRequest.get(`${BASE_URL}/categories`, null);

                expect(data1.items).to.have.length(1);
                expect(data1.items[0].name).to.equal(testCategory.name);
                expect(data1.items[0].slug).to.equal(testCategory.slug);
                expect(data2.items).to.have.length(1);
                expect(data2.items[0].name).to.equal("Hello World");
                expect(data2.items[0].slug).to.equal("hello-world");
                done();
            }).catch((err) => {
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

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                yield httpRequest.post(`${BASE_URL}/categories`, cat2);
                var data1 = yield httpRequest.get(`${BASE_URL}/categories`);
                yield httpRequest.del(`${BASE_URL}/categories/${data1.items[0]._id}`);
                var data2 = yield httpRequest.get(`${BASE_URL}/categories`);

                expect(data1.items).to.have.length(2);
                expect(data2.items).to.have.length(1);
                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });
    });

    describe('/posts', () => {

        it('should create a new post', (done) => {

            var testBlog = {
                title: "My Blog",
                slug: "my-blog",
                posts_per_page: 1
            };



            co(function* () {
                var category = yield httpRequest.post(`${BASE_URL}/categories`, testCategory);
                var user = yield httpRequest.get(`${BASE_URL}/users/me`);
                var blog = yield httpRequest.post(`${BASE_URL}/blogs`, testBlog);

                var testPost1 = {
                    "title": "b ## My Post Title! ",
                    "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
                    "slug": "testtset",
                    "publish_date": new Date("2011-1-11 11:11:11"),
                    "tags": ["tag1", "tag2"],
                    "is_draft": false,
                    "category": category._id,
                    "author": user._id,
                    "blog": blog._id
                };

                var testPost2 = {
                    "title": "a It is - the  title 1 --- ",
                    "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
                    "slug": "3fasd3ea",
                    "publish_date": new Date("2020-2-22 22:22:22"),
                    "is_draft": false,
                    "category": category._id,
                    "author": user._id,
                    "blog": blog._id
                };

                var testPost3 = {
                    "title": "c It is - the  title 2 --- ",
                    "content": "Lorem ipsum dolor sit amet, altera legendos voluptatum sea eu, his te tota congue vivendum. Ei vix molestie iracundia definitionem, eu duo errem sapientem. Sit brute vivendum cu, ne sed fuisset delectus, nobis impetus prompta vim ea. Per consul iisque ut, sea elitr vitae accumsan ei. Quo idque graecis senserit cu.",
                    "slug": "dsfsdfsd",
                    "publish_date": new Date("1990-9-19 9:00:00"),
                    "tags": ["tag1"],
                    "is_draft": true,
                    "category": category._id,
                    "author": user._id,
                    "blog": blog._id
                };

                var createdPost1 = yield httpRequest.post(`${BASE_URL}/posts`, testPost1);
                var createdPost2 = yield httpRequest.post(`${BASE_URL}/posts`, testPost2);
                var createdPost3 = yield httpRequest.post(`${BASE_URL}/posts`, testPost3);

                var dataSortedByTitle = yield httpRequest.get(`${BASE_URL}/posts?sort=title`);
                var titles = dataSortedByTitle.items.map(post => post.title);

                var dataSortedByPublishDate = yield httpRequest.get(`${BASE_URL}/posts?sort=publish_date`);
                var publish_dates = dataSortedByPublishDate.items.map(post => post.publish_date);

                var dataLimited = yield httpRequest.get(`${BASE_URL}/posts?limit=2`);

                var dataSortedAndLimited = yield httpRequest.get(`${BASE_URL}/posts?sort=publish_date+-1,title+1&offset=2&limit=1`);

                expect(createdPost1._id).to.be.string;
                expect(createdPost1.title).to.equal(testPost1.title);
                expect(createdPost1.slug).to.equal(testPost1.slug);
                expect(createdPost1.content).to.equal(testPost1.content);
                expect(createdPost1.tags).to.include("tag1");
                expect(createdPost1.tags).to.include("tag2");

                expect(createdPost2._id).to.be.string;
                expect(createdPost2.title).to.equal(testPost2.title);
                expect(createdPost2.slug).to.equal(testPost2.slug);
                expect(createdPost2.content).to.equal(testPost2.content);

                expect(titles[0]).to.equal(testPost2.title);
                expect(titles[1]).to.equal(testPost1.title);
                expect(titles[2]).to.equal(testPost3.title);

                expect(new Date(publish_dates[0]).getTime()).to.equal(testPost3.publish_date.getTime());
                expect(new Date(publish_dates[1]).getTime()).to.equal(testPost1.publish_date.getTime());
                expect(new Date(publish_dates[2]).getTime()).to.equal(testPost2.publish_date.getTime());

                expect(dataLimited.items.length).to.equal(2);

                expect(dataSortedAndLimited.items.length).to.equal(1);
                expect(new Date(dataSortedAndLimited.items[0].publish_date).getTime()).to.equal(testPost3.publish_date.getTime());

                done();
            }).catch((err) => {
                console.error(err);
                done(new Error());
            });
        });

    });
});
