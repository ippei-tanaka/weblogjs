require('../../app/babel-request');

import configFile from '../config.json';
import co from 'co';
import { expect } from 'chai';
import httpRequest from '../../utils/http-request';
import WeblogJS from '../../app';

const admin = Object.freeze(Object.assign({
    email: "ttt@ttt.com",
    password: "tttttttt",
    display_name: "Admin",
    slug: 'admin'
}));

const testUser = Object.freeze({
    "email": "email1@example.com",
    "password": "test1234",
    "slug": "slug-test1234",
    "display_name": "Test User 1"
});

const testCategory = Object.freeze({
    "name": "Oh My Category",
    "slug": "oh-my-category"
});

const testBlog = Object.freeze({
    "name": "My Blog",
    "slug": "my-blog",
    "posts_per_page": 5
});

const testPost = Object.freeze({
    "title": "My Post",
    "slug": "my-post",
    "content": "Hello, world!"
});

const BASE_URL = `http://${configFile.web_server_host}:${configFile.web_server_port}${configFile.restful_api_root}`;

WeblogJS.init({
    dbHost: configFile.database_host,
    dbPort: configFile.database_port,
    dbName: configFile.database_name,
    webHost: configFile.web_server_host,
    webPort: configFile.web_server_port,
    apiRoot: configFile.restful_api_root
});

const login = () => httpRequest.post(`${BASE_URL}/login`, admin);
const logout = () => httpRequest.get(`${BASE_URL}/logout`);

describe('Restful API', function () {

    this.timeout(5000);

    before('web server starting', () => WeblogJS.webServer.start());
    before('dropping darabase', () => WeblogJS.dbSettingOperator.dropDatabase());
    before('creating indexes', () => WeblogJS.dbSettingOperator.createIndexes());
    beforeEach('emptying collections', () => WeblogJS.dbSettingOperator.removeAllDocuments());
    beforeEach('creating admin', () => WeblogJS.createUser(admin));

    describe('/home', () => {
        it('should return an empty object', (done) => {
            co(function* () {
                const obj = yield httpRequest.get(`${BASE_URL}/`);
                expect(Object.keys(obj).length).to.equal(0);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });

    describe('/login', () => {
        it('should give a 401 error if the user try to retrieve restricted data when they haven\'t logged in', (done) => {
            co(function* () {
                try {
                    yield httpRequest.get(`${BASE_URL}/users`);
                } catch (error) {
                    expect(error.response.statusCode).to.equal(401);
                }
                done();
            }).catch(e => {
                done(e);
            });
        });

        it('should let the user log in and log out', (done) => {
            co(function* () {
                yield httpRequest.post(`${BASE_URL}/login`, admin);
                const users = yield httpRequest.get(`${BASE_URL}/users`);
                yield httpRequest.get(`${BASE_URL}/logout`);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });

    describe('/users', () => {

        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        it('should return the login user data', (done) => {
            co(function* () {
                const user = yield httpRequest.get(`${BASE_URL}/users/me`);
                expect(user.email).to.equal(admin.email);
                expect(user.slug).to.equal(admin.slug);
                expect(user.display_name).to.equal(admin.display_name);
                expect(user).to.not.have.property('password');
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should create a new user', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/users`, testUser);
                const user = yield httpRequest.get(`${BASE_URL}/users/${_id}`);
                expect(user._id).to.equal(_id);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not include a password in the retrieved user data', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/users`, testUser);
                const user = yield httpRequest.get(`${BASE_URL}/users/${_id}`);
                expect(user).to.not.have.property('password');
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it("should update a user's display name", (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/users`, testUser);

                let user = yield httpRequest.get(`${BASE_URL}/users/${_id}`);
                expect(user["display_name"]).to.equal(testUser.display_name);

                yield httpRequest.put(`${BASE_URL}/users/${_id}`, {
                    display_name: "My new name"
                });

                user = yield httpRequest.get(`${BASE_URL}/users/${_id}`);
                expect(user["display_name"]).to.equal("My new name");

                done();
            }).catch((e) => {
                done(e);
            });
        });

        it("should not update a user's password unless their old password is sent", (done) => {
            co(function* () {
                let error;

                try {
                    const { _id } = yield httpRequest.post(`${BASE_URL}/users`, testUser);
                    yield httpRequest.put(`${BASE_URL}/users/${_id}`, {
                        password: "NewPassword@@@"
                    });
                } catch (e) {
                    error = e;
                }

                expect(error.body.old_password[0].message).to.equal('To change the password, the current password has to be sent.');

                done();

            }).catch((e) => {
                done(e);
            });
        });

        it("should update a user's password if their old password is sent", (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/users`, testUser);

                yield httpRequest.put(`${BASE_URL}/users/${_id}`, {
                    password: "NewPassword@@@",
                    old_password: testUser.password
                });

                done();
            }).catch((e) => {
                done(e);
            });
        });

        it("should not update a user's password if their old password is wrong", (done) => {
            co(function* () {

                let error;

                try {
                    const { _id } = yield httpRequest.post(`${BASE_URL}/users`, testUser);

                    yield httpRequest.put(`${BASE_URL}/users/${_id}`, {
                        password: "NewPassword@@@",
                        old_password: "WrongPassword"
                    });
                } catch (e) {
                    error = e;
                }

                expect(error.body.old_password[0].message).to.equal('The current password sent is not correct.');

                done();
            }).catch((e) => {
                done(e);
            });
        });
    });

    describe('/categories', () => {

        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        it('should create a new category', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/categories`, testCategory);
                const category = yield httpRequest.get(`${BASE_URL}/categories/${_id}`);
                expect(category._id).to.be.string;
                expect(category.name).to.equal(testCategory.name);
                expect(category.slug).to.equal(testCategory.slug);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not create a new category when the slug is duplicated', (done) => {
            const cat1 = {name: 'Category Name', slug: 'my0slug1'};
            const cat2 = {name: 'Rondom Name', slug: 'my0slug1'};

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                yield httpRequest.post(`${BASE_URL}/categories`, cat2);
                done(new Error());
            }).catch(() => {
                done();
            });
        });

        it('should not create a new category if the posted object has an empty value for a required field.', (done) => {
            co(function* () {
                try {
                    yield httpRequest.post(`${BASE_URL}/categories`, {
                        name: '',
                        slug: ''
                    });
                } catch (error) {
                    expect(error.body.name[0].message).to.equal('A name is required.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not create a new category if the posted object has an invalid value.', (done) => {
            co(function* () {
                try {
                    yield httpRequest.post(`${BASE_URL}/categories`, {
                        name: '123456789',
                        slug: 'd d'
                    });
                } catch (error) {
                    expect(error.body.slug[0].message).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should partially update a category', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/categories`, testCategory);
                const data1 = yield httpRequest.get(`${BASE_URL}/categories/${_id}`);
                yield httpRequest.put(`${BASE_URL}/categories/${_id}`, {
                    name: "Hello World"
                });
                const data2 = yield httpRequest.get(`${BASE_URL}/categories/${_id}`);

                expect(data1.name).to.equal(testCategory.name);
                expect(data1.slug).to.equal(testCategory.slug);
                expect(data2.name).to.equal("Hello World");
                expect(data2.slug).to.equal(testCategory.slug);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not update a category when the slug is duplicated.', (done) => {
            co(function* () {
                try {
                    const cat1 = {name: "Foo", slug: "foo"};
                    const cat2 = {name: "Bar", slug: "bar"};
                    yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                    const id2 = (yield httpRequest.post(`${BASE_URL}/categories`, cat2))._id;
                    yield httpRequest.put(`${BASE_URL}/categories/${id2}`, {slug: "foo"});
                } catch (error) {
                    expect(error.body.slug[0].message).to.equal('The slug, "foo", has already been taken.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not update a category if the posted object is not valid.', (done) => {
            co(function* () {
                let name = "";

                while (name.length < 250) { name += "a" }

                try {
                    const cat = {name: name, slug: "fo o"};
                    yield httpRequest.post(`${BASE_URL}/categories`, cat);
                } catch (error) {
                    expect(error.body.name[0].message).to.equal('A name should be between 1 and 200 characters.');
                    expect(error.body.slug[0].message).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should delete a category', (done) => {
            const cat1 = {name: "Foo", slug: "foo"};
            const cat2 = {name: "Bar", slug: "bar"};

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                yield httpRequest.post(`${BASE_URL}/categories`, cat2);
                var data1 = yield httpRequest.get(`${BASE_URL}/categories`);
                yield httpRequest.del(`${BASE_URL}/categories/${data1.items[0]._id}`);
                var data2 = yield httpRequest.get(`${BASE_URL}/categories`);

                expect(data1.items).to.have.length(2);
                expect(data2.items).to.have.length(1);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should return a list of categories', (done) => {
            const cat1 = {name: "Foo", slug: "foo"};
            const cat2 = {name: "Bar", slug: "bar"};
            const cat3 = {name: "Foo Bar", slug: "foobar"};

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/categories`, cat1);
                yield httpRequest.post(`${BASE_URL}/categories`, cat2);
                yield httpRequest.post(`${BASE_URL}/categories`, cat3);
                var data = yield httpRequest.get(`${BASE_URL}/categories`);
                expect(data.items).to.have.length(3);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should return a category', (done) => {
            co(function* () {
                const createdCategory = yield httpRequest.post(`${BASE_URL}/categories`, testCategory);
                const retreivedCategory = yield  httpRequest.get(`${BASE_URL}/categories/${createdCategory._id}`);
                expect(retreivedCategory._id).to.equal(createdCategory._id);
                expect(retreivedCategory.name).to.equal(testCategory.name);
                expect(retreivedCategory.slug).to.equal(testCategory.slug);
                done();
            }).catch((e) => {
                done(e);
            });
        });

    });

    describe('/blogs', () => {

        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        it('should create a new blog', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/blogs`, testBlog);
                const blog = yield httpRequest.get(`${BASE_URL}/blogs/${_id}`);
                expect(blog._id).to.be.string;
                expect(blog.name).to.equal(testBlog.name);
                expect(blog.slug).to.equal(testBlog.slug);
                expect(blog.posts_per_page).to.equal(testBlog.posts_per_page);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not create a new blog when the slug is duplicated', (done) => {

            const blog1 = {
                name: 'Here My Blog 1',
                slug: 'heremyblog',
                posts_per_page: 10
            };

            const blog2 = {
                name: 'Here My Blog 2',
                slug: 'heremyblog',
                posts_per_page: 3
            };

            co(function* () {
                try {
                    yield httpRequest.post(`${BASE_URL}/blogs`, blog1);
                    yield httpRequest.post(`${BASE_URL}/blogs`, blog2);
                } catch (error) {
                    expect(error.body.slug[0].message).to.equal('The slug, "heremyblog", has already been taken.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not create a new blog if the posted object has an empty value for a required field.', (done) => {
            co(function* () {
                try {
                    yield httpRequest.post(`${BASE_URL}/blogs`, {
                        name: 'Happy Blog',
                        slug: 'happy-blog'
                    });
                } catch (error) {
                    expect(error.body.posts_per_page[0].message).to.equal('A posts_per_page is required.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not create a new blog if the posted object has an invalid value.', (done) => {
            co(function* () {
                try {
                    yield httpRequest.post(`${BASE_URL}/blogs`, {
                        name: '123456789',
                        slug: 'd d',
                        posts_per_page: 12
                    });
                } catch (error) {
                    expect(error.body.slug[0].message).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should update a blog', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/blogs`, testBlog);
                const data1 = yield httpRequest.get(`${BASE_URL}/blogs/${_id}`);
                yield httpRequest.put(`${BASE_URL}/blogs/${_id}`, {
                    name: "Hello World",
                    slug: "hello-world",
                    posts_per_page: 5
                });
                const data2 = yield httpRequest.get(`${BASE_URL}/blogs/${_id}`);
                expect(data1.name).to.equal(testBlog.name);
                expect(data1.slug).to.equal(testBlog.slug);
                expect(data2.name).to.equal("Hello World");
                expect(data2.slug).to.equal("hello-world");
                expect(data2.posts_per_page).to.equal(5);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not update a blog when the slug is duplicated.', (done) => {
            co(function* () {
               try {
                   const blog1 = {name: "Foo", slug: "foo", posts_per_page: 1};
                   const blog2 = {name: "Bar", slug: "bar", posts_per_page: 1};
                   yield httpRequest.post(`${BASE_URL}/blogs`, blog1);
                   const id2 = (yield httpRequest.post(`${BASE_URL}/blogs`, blog2))._id;
                   yield httpRequest.put(`${BASE_URL}/blogs/${id2}`, {slug: "foo"});
               } catch (error) {
                   expect(error.body.slug[0].message).to.equal('The slug, "foo", has already been taken.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should not update a blog if the posts_per_page is a negative number.', (done) => {
            co(function* () {
               try {
                   const cat = {name: "Foo", slug: "foo", posts_per_page: -1};
                   yield httpRequest.post(`${BASE_URL}/blogs`, cat);
               } catch (error) {
                    expect(error.body.posts_per_page[0].message).to.equal('A posts_per_page should be greater than 0.');
                }
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should delete a blog', (done) => {
            const blog1 = {name: "Foo", slug: "foo", posts_per_page: 1};
            const blog2 = {name: "Bar", slug: "bar", posts_per_page: 1};

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/blogs`, blog1);
                yield httpRequest.post(`${BASE_URL}/blogs`, blog2);
                var data1 = yield httpRequest.get(`${BASE_URL}/blogs`);
                yield httpRequest.del(`${BASE_URL}/blogs/${data1.items[0]._id}`);
                var data2 = yield httpRequest.get(`${BASE_URL}/blogs`);

                expect(data1.items).to.have.length(2);
                expect(data2.items).to.have.length(1);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should return a list of blogs', (done) => {

            const blog1 = {name: "Foo", slug: "foo", posts_per_page: 1};
            const blog2 = {name: "Bar", slug: "bar", posts_per_page: 1};
            const blog3 = {name: "Foo Bar", slug: "foobar", posts_per_page: 1};

            co(function* () {
                yield httpRequest.post(`${BASE_URL}/blogs`, blog1);
                yield httpRequest.post(`${BASE_URL}/blogs`, blog2);
                yield httpRequest.post(`${BASE_URL}/blogs`, blog3);
                var data = yield httpRequest.get(`${BASE_URL}/blogs`);
                expect(data.items).to.have.length(3);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should return a blog', (done) => {
            co(function* () {
                var createdBlog = yield httpRequest.post(`${BASE_URL}/blogs`, testBlog);
                var retreivedBlog = yield  httpRequest.get(`${BASE_URL}/blogs/${createdBlog._id}`);
                expect(retreivedBlog._id).to.equal(createdBlog._id);
                expect(retreivedBlog.name).to.equal(testBlog.name);
                expect(retreivedBlog.slug).to.equal(testBlog.slug);
                done();
            }).catch((e) => {
                done(e);
            });
        });

    });

    describe('/posts', () => {

        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        const createOptionalData = (prefix = "") => co(function* () {

            let result = yield httpRequest.post(`${BASE_URL}/users`, {
                email: `${prefix}test@test.com`,
                password: "testtest",
                slug: `${prefix}test-test`,
                display_name: `${prefix}Test User`
            });

            const user = yield httpRequest.get(`${BASE_URL}/users/${result._id}`);

            result = yield httpRequest.post(`${BASE_URL}/blogs`, {
                name: `${prefix}Test Blog`,
                slug: `${prefix}test-blog`,
                posts_per_page: "5"
            });

            const blog = yield httpRequest.get(`${BASE_URL}/blogs/${result._id}`);

            result = yield httpRequest.post(`${BASE_URL}/categories`, {
                name: `${prefix}Test Category`,
                slug: `${prefix}test-category`
            });

            const category = yield httpRequest.get(`${BASE_URL}/categories/${result._id}`);

            return {
                author_id: user._id,
                blog_id: blog._id,
                category_id: category._id
            };
        });

        it('should create a new post', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/posts`, testPost);
                yield httpRequest.get(`${BASE_URL}/posts/${_id}`);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should return a post', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/posts`, testPost);
                const post = yield httpRequest.get(`${BASE_URL}/posts/${_id}`);
                expect(post._id).to.equal(_id);
                expect(post.title).to.equal(testPost.title);
                expect(post.slug).to.equal(testPost.slug);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should return a list of posts', (done) => {
            co(function* () {
                const options = yield createOptionalData();
                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({}, testPost, options, {slug: '1'}));
                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({}, testPost, options, {slug: '2'}));
                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({}, testPost, options, {slug: '3'}));
                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({}, testPost, options, {slug: '4'}));
                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({}, testPost, options, {slug: '5'}));
                const json = yield httpRequest.get(`${BASE_URL}/posts/`);
                const posts = json.items;

                expect(posts.length).to.equal(5);
                let count = 1;

                for (let post of posts) {
                    expect(post._id).to.be.string;
                    expect(post.title).to.equal(testPost.title);
                    expect(post.slug).to.equal(String(count));
                    expect(post.author_id).to.equal(options.author_id);
                    expect(post.blog_id).to.equal(options.blog_id);
                    expect(post.category_id).to.equal(options.category_id);
                    count++;
                }

                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should return a filtered and sorted list of posts', (done) => {
            co(function* () {
                const options1 = yield createOptionalData(1);
                const options2 = yield createOptionalData(2);

                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({
                    title: "Intro to Javascript",
                    slug: "intro-to-js",
                    content: "Not Yet"
                }, options1));

                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({
                    title: "Questions about Life",
                    slug: "questions",
                    content: "I don't know!"
                }, options2));

                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({
                    title: "Favourite Food",
                    slug: "favourite-food",
                    content: "I like miso soup and beef stew."
                }, options2));

                yield httpRequest.post(`${BASE_URL}/posts`, Object.assign({
                    title: "Abstract Food",
                    slug: "abstract-food",
                    content: "Diet Food"
                }, options2));

                let json = yield httpRequest.get(`${BASE_URL}/posts/?query={"slug":"questions"}`);
                let posts = json.items;

                expect(posts.length).to.equal(1);
                expect(posts[0].title).to.equal("Questions about Life");

                json = yield httpRequest.get(`${BASE_URL}/posts/?skip=1&limit=2&sort={"slug":1}`);
                posts = json.items;

                expect(posts.length).to.equal(2);
                expect(posts[0].title).to.equal("Favourite Food");
                expect(posts[1].title).to.equal("Intro to Javascript");

                done();
            }).catch((e) => {
                done(e);
            });
        });

    });

    describe('/setting', () => {

        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        it('should return the empty setting if nothing is set', (done) => {
            co(function* () {
                const setting = yield httpRequest.get(`${BASE_URL}/setting`);
                expect(Object.keys(setting).length).to.equal(0);
                done();
            }).catch((e) => {
                done(e);
            });
        });

        it('should set a blog to the setting', (done) => {
            co(function* () {
                const { _id } = yield httpRequest.post(`${BASE_URL}/blogs`, testBlog);
                yield httpRequest.post(`${BASE_URL}/setting`, { front: _id });
                const setting = yield httpRequest.get(`${BASE_URL}/setting`);
                expect(setting.front).to.equal(_id);
                done();
            }).catch((e) => {
                done(e);
            });
        });

    });

});
