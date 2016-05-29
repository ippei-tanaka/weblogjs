require('../../babel-request');

import co from 'co';
import { expect } from 'chai';
import httpRequest from '../../utils/http-request';
import WeblogJS from '../../app';
import WEBLOG_ENV from '../../env-variables';

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
    "content": "Hello, world!",
    "tags": ["tag1", "tag2", "tag3"],
    "published_date": new Date(),
    "is_draft": false
});

const WEBSERVER_HOST = WEBLOG_ENV.web_host;
const WEBSERVER_PORT = WEBLOG_ENV.web_port;
const ADMIN_API_ROOT = WEBLOG_ENV.admin_api_root;
const PUBLIC_API_ROOT = WEBLOG_ENV.public_api_root;
const ADMIN_URL = `http://${WEBSERVER_HOST}:${WEBSERVER_PORT}${ADMIN_API_ROOT}`;
const PUBLIC_URL = `http://${WEBSERVER_HOST}:${WEBSERVER_PORT}${PUBLIC_API_ROOT}`;

WeblogJS.init({
    dbName: "weblogjstest"
});

const login = () => httpRequest.post(`${ADMIN_URL}/login`, admin);
const logout = () => httpRequest.get(`${ADMIN_URL}/logout`);

describe('Restful API', function () {

    this.timeout(5000);

    before('web server starting', () => WeblogJS.webServer.start());
    before('dropping darabase', () => WeblogJS.dbSettingOperator.dropDatabase());
    before('creating indexes', () => WeblogJS.dbSettingOperator.createIndexes());
    beforeEach('emptying collections', () => WeblogJS.dbSettingOperator.removeAllDocuments());
    beforeEach('creating admin', () => WeblogJS.createUser(admin));

    describe('Admin API', () => {

        describe('/home', () => {
            it('should return an empty object', (done) => {
                co(function* () {
                    const obj = yield httpRequest.get(`${ADMIN_URL}/`);
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
                    let error;
                    try {
                        yield httpRequest.get(`${ADMIN_URL}/users`);
                    } catch (e) {
                        error = e;
                    }
                    expect(error.response.statusCode).to.equal(401);
                    done();
                }).catch(e => {
                    done(e);
                });
            });

            it('should let the user log in and log out', (done) => {
                co(function* () {
                    yield httpRequest.post(`${ADMIN_URL}/login`, admin);
                    const users = yield httpRequest.get(`${ADMIN_URL}/users`);
                    yield httpRequest.get(`${ADMIN_URL}/logout`);
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
                    const user = yield httpRequest.get(`${ADMIN_URL}/users/me`);
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
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    const user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user._id).to.equal(_id);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should not include a password in the retrieved user data', (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    const user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user).to.not.have.property('password');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it("should update a user's display name", (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                    let user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user["display_name"]).to.equal(testUser.display_name);

                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}`, {
                        display_name: "My new name"
                    });

                    user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user["display_name"]).to.equal("My new name");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it("should not update a user's password on '/users/:id/' path", (done) => {
                co(function* () {
                    let error;

                    try {
                        const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}`, {
                            password: "NewPassword@@@",
                            password_confirmed: "NewPassword@@@",
                            old_password: testUser.password
                        });
                    } catch (e) {
                        error = e;
                    }

                    expect(error.body.password[0].message).to.equal("The password can't be updated.");

                    done();

                }).catch((e) => {
                    done(e);
                });
            });

            it("should not update a user's password unless the confirmed password and their old password is sent", (done) => {
                co(function* () {
                    let error;

                    try {
                        const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "NewPassword@@@"
                        });
                    } catch (e) {
                        error = e;
                    }

                    expect(error.body.old_password[0].message).to.equal('The current password is required.');
                    expect(error.body.password_confirmed[0].message).to.equal('The confirmed password is required.');

                    done();

                }).catch((e) => {
                    done(e);
                });
            });

            it("should update a user's password if the confirmed password and their old password is sent", (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                        password: "NewPassword@@@",
                        password_confirmed: "NewPassword@@@",
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
                        const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "NewPassword@@@",
                            password_confirmed: "NewPassword@@@",
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

            it("should not update a user's password if the confirmed password is wrong", (done) => {
                co(function* () {

                    let error;

                    try {
                        const { _id } = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "NewPassword@@@",
                            password_confirmed: "qwerqwer",
                            old_password: testUser.password
                        });
                    } catch (e) {
                        error = e;
                    }

                    expect(error.body.password_confirmed[0].message).to.equal('The confirmed password sent is not the same as the new password.');

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
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                    const category = yield httpRequest.get(`${ADMIN_URL}/categories/${_id}`);
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
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                    done(new Error());
                }).catch(() => {
                    done();
                });
            });

            it('should not create a new category if the posted object has an empty value for a required field.', (done) => {
                co(function* () {
                    let error;

                    try {
                        yield httpRequest.post(`${ADMIN_URL}/categories`, {
                            name: '',
                            slug: ''
                        });
                    } catch (e) {
                        error = e;
                    }

                    expect(error.body.name[0].message).to.equal('A name is required.');

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should not create a new category if the posted object has an invalid value.', (done) => {
                co(function* () {
                    let error;

                    try {
                        yield httpRequest.post(`${ADMIN_URL}/categories`, {
                            name: '123456789',
                            slug: 'd d'
                        });
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.slug[0].message).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should partially update a category', (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                    const data1 = yield httpRequest.get(`${ADMIN_URL}/categories/${_id}`);
                    yield httpRequest.put(`${ADMIN_URL}/categories/${_id}`, {
                        name: "Hello World"
                    });
                    const data2 = yield httpRequest.get(`${ADMIN_URL}/categories/${_id}`);

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
                    let error;

                    try {
                        const cat1 = {name: "Foo", slug: "foo"};
                        const cat2 = {name: "Bar", slug: "bar"};
                        yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                        const id2 = (yield httpRequest.post(`${ADMIN_URL}/categories`, cat2))._id;
                        yield httpRequest.put(`${ADMIN_URL}/categories/${id2}`, {slug: "foo"});
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.slug[0].message).to.equal('The slug, "foo", has already been taken.');

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should not update a category if the posted object is not valid.', (done) => {
                co(function* () {
                    let error;
                    let name = "";

                    while (name.length < 250) {
                        name += "a"
                    }

                    try {
                        const cat = {name: name, slug: "fo o"};
                        yield httpRequest.post(`${ADMIN_URL}/categories`, cat);
                    } catch (e) {
                        error = e;
                    }

                    expect(error.body.slug[0].message).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should delete a category', (done) => {
                const cat1 = {name: "Foo", slug: "foo"};
                const cat2 = {name: "Bar", slug: "bar"};

                co(function* () {
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                    var data1 = yield httpRequest.get(`${ADMIN_URL}/categories`);
                    yield httpRequest.del(`${ADMIN_URL}/categories/${data1.items[0]._id}`);
                    var data2 = yield httpRequest.get(`${ADMIN_URL}/categories`);

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
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat3);
                    var data = yield httpRequest.get(`${ADMIN_URL}/categories`);
                    expect(data.items).to.have.length(3);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return a category', (done) => {
                co(function* () {
                    const createdCategory = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                    const retreivedCategory = yield  httpRequest.get(`${ADMIN_URL}/categories/${createdCategory._id}`);
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
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/blogs`, testBlog);
                    const blog = yield httpRequest.get(`${ADMIN_URL}/blogs/${_id}`);
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
                    let error;
                    try {
                        yield httpRequest.post(`${ADMIN_URL}/blogs`, blog1);
                        yield httpRequest.post(`${ADMIN_URL}/blogs`, blog2);
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.slug[0].message).to.equal('The slug, "heremyblog", has already been taken.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should not create a new blog if the posted object has an empty value for a required field.', (done) => {
                co(function* () {
                    let error;
                    try {
                        yield httpRequest.post(`${ADMIN_URL}/blogs`, {
                            name: 'Happy Blog',
                            slug: 'happy-blog'
                        });
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.posts_per_page[0].message).to.equal('A posts_per_page is required.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should not create a new blog if the posted object has an invalid value.', (done) => {
                co(function* () {
                    let error;
                    try {
                        yield httpRequest.post(`${ADMIN_URL}/blogs`, {
                            name: '123456789',
                            slug: 'd d',
                            posts_per_page: 12
                        });
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.slug[0].message).to.equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return type error messages', (done) => {
                co(function* () {
                    let error;
                    try {
                        yield httpRequest.post(`${ADMIN_URL}/blogs`, {
                            name: "Hello World",
                            slug: "hello-world",
                            posts_per_page: "test"
                        });
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.posts_per_page[0].message).to.equal('The posts_per_page, "test", is invalid.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should update a blog', (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/blogs`, testBlog);
                    const data1 = yield httpRequest.get(`${ADMIN_URL}/blogs/${_id}`);
                    yield httpRequest.put(`${ADMIN_URL}/blogs/${_id}`, {
                        name: "Hello World",
                        slug: "hello-world",
                        posts_per_page: 5
                    });
                    const data2 = yield httpRequest.get(`${ADMIN_URL}/blogs/${_id}`);
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
                    let error;
                    try {
                        const blog1 = {name: "Foo", slug: "foo", posts_per_page: 1};
                        const blog2 = {name: "Bar", slug: "bar", posts_per_page: 1};
                        yield httpRequest.post(`${ADMIN_URL}/blogs`, blog1);
                        const id2 = (yield httpRequest.post(`${ADMIN_URL}/blogs`, blog2))._id;
                        yield httpRequest.put(`${ADMIN_URL}/blogs/${id2}`, {slug: "foo"});
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.slug[0].message).to.equal('The slug, "foo", has already been taken.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should not update a blog if the posts_per_page is a negative number.', (done) => {
                co(function* () {
                    let error;
                    try {
                        const cat = {name: "Foo", slug: "foo", posts_per_page: -1};
                        yield httpRequest.post(`${ADMIN_URL}/blogs`, cat);
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.posts_per_page[0].message).to.equal('A posts_per_page should be greater than 0.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should delete a blog', (done) => {
                const blog1 = {name: "Foo", slug: "foo", posts_per_page: 1};
                const blog2 = {name: "Bar", slug: "bar", posts_per_page: 1};

                co(function* () {
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, blog1);
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, blog2);
                    var data1 = yield httpRequest.get(`${ADMIN_URL}/blogs`);
                    yield httpRequest.del(`${ADMIN_URL}/blogs/${data1.items[0]._id}`);
                    var data2 = yield httpRequest.get(`${ADMIN_URL}/blogs`);

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
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, blog1);
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, blog2);
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, blog3);
                    var data = yield httpRequest.get(`${ADMIN_URL}/blogs`);
                    expect(data.items).to.have.length(3);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return a blog', (done) => {
                co(function* () {
                    var createdBlog = yield httpRequest.post(`${ADMIN_URL}/blogs`, testBlog);
                    var retreivedBlog = yield  httpRequest.get(`${ADMIN_URL}/blogs/${createdBlog._id}`);
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

                let result = yield httpRequest.post(`${ADMIN_URL}/users`, {
                    email: `${prefix}test@test.com`,
                    password: "testtest",
                    slug: `${prefix}test-test`,
                    display_name: `${prefix}Test User`
                });

                const user = yield httpRequest.get(`${ADMIN_URL}/users/${result._id}`);

                result = yield httpRequest.post(`${ADMIN_URL}/blogs`, {
                    name: `${prefix}Test Blog`,
                    slug: `${prefix}test-blog`,
                    posts_per_page: "5"
                });

                const blog = yield httpRequest.get(`${ADMIN_URL}/blogs/${result._id}`);

                result = yield httpRequest.post(`${ADMIN_URL}/categories`, {
                    name: `${prefix}Test Category`,
                    slug: `${prefix}test-category`
                });

                const category = yield httpRequest.get(`${ADMIN_URL}/categories/${result._id}`);

                return {
                    author_id: user._id,
                    blog_id: blog._id,
                    category_id: category._id
                };
            });

            it('should create a new post', (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/posts`, testPost);
                    yield httpRequest.get(`${ADMIN_URL}/posts/${_id}`);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return a post', (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/posts`, testPost);
                    const post = yield httpRequest.get(`${ADMIN_URL}/posts/${_id}`);
                    expect(post._id).to.equal(_id);
                    expect(post.title).to.equal(testPost.title);
                    expect(post.slug).to.equal(testPost.slug);
                    expect(post.tags).to.include(testPost.tags[0]);
                    expect(post.tags).to.include(testPost.tags[1]);
                    expect(post.tags).to.include(testPost.tags[2]);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return type error messages', (done) => {
                co(function* () {
                    let error;
                    try {
                        yield httpRequest.post(`${ADMIN_URL}/posts`, {
                            title: "Hello World",
                            slug: "hello-world",
                            content: "test",
                            author_id: "ddddd"
                        });
                    } catch (e) {
                        error = e;
                    }
                    expect(error.body.author_id[0].message).to.equal('The author ID, "ddddd", is invalid.');
                    done();
                }).catch((e) => {
                    done(e);
                });
            });


            it('should return a list of posts', (done) => {
                co(function* () {
                    const options = yield createOptionalData();
                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '1'}));
                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '2'}));
                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '3'}));
                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '4'}));
                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options, {slug: '5'}));
                    const json = yield httpRequest.get(`${ADMIN_URL}/posts/`);
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

                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                        title: "Intro to Javascript",
                        slug: "intro-to-js",
                        content: "Not Yet"
                    }, options1));

                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                        title: "Questions about Life",
                        slug: "questions",
                        content: "I don't know!"
                    }, options2));

                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                        title: "Favourite Food",
                        slug: "favourite-food",
                        content: "I like miso soup and beef stew."
                    }, options2));

                    yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({
                        title: "Abstract Food",
                        slug: "abstract-food",
                        content: "Diet Food"
                    }, options2));

                    let json = yield httpRequest.get(`${ADMIN_URL}/posts/?query={"slug":"questions"}`);
                    let posts = json.items;

                    expect(posts.length).to.equal(1);
                    expect(posts[0].title).to.equal("Questions about Life");

                    json = yield httpRequest.get(`${ADMIN_URL}/posts/?skip=1&limit=2&sort={"slug":1}`);
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
                    const setting = yield httpRequest.get(`${ADMIN_URL}/setting`);
                    expect(Object.keys(setting).length).to.equal(0);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should set a blog to the setting', (done) => {
                co(function* () {
                    const { _id } = yield httpRequest.post(`${ADMIN_URL}/blogs`, testBlog);
                    yield httpRequest.put(`${ADMIN_URL}/setting`, {front_blog_id: _id});
                    const setting = yield httpRequest.get(`${ADMIN_URL}/setting`);
                    expect(setting.front_blog_id).to.equal(_id);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

        });

    });


    describe('Public API', () => {

        beforeEach('login', () => login());
        afterEach('logout', () => logout());

        describe('/blogs', () => {

            it('should return all the blogs', (done) => {
                co(function* () {
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "5"});
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 2", slug: "blog-2", posts_per_page: "5"});
                    yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 3", slug: "blog-3", posts_per_page: "5"});
                    const blogs = yield httpRequest.get(`${PUBLIC_URL}/blogs`);
                    expect(blogs.items[0].name).to.equal("Blog 1");
                    expect(blogs.items[1].name).to.equal("Blog 2");
                    expect(blogs.items[2].name).to.equal("Blog 3");
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

        });

        describe('[/blog/:slug][/category/:slug][/author/:slug][/tag/:tag]/posts[/page/:page]', () => {

            it('should return public posts on the first page of the blog', (done) => {
                co(function* () {

                    let response;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "10"});
                    const blogId1 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 2", slug: "blog-2", posts_per_page: "5"});
                    const blogId2 = response._id;

                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
                    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, published_date: tomorrow});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, is_draft: false, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId1, is_draft: true, published_date: yesterday});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 6", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 7", slug:"post", content: "Test", blog_id: blogId2, published_date: yesterday});

                    let posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/posts`);
                    expect(posts.items.length).to.equal(3);
                    expect(posts.items[0].title).to.equal("Post 2");
                    expect(posts.items[1].title).to.equal("Post 4");
                    expect(posts.items[2].title).to.equal("Post 6");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return public posts on the first page of the front blog', (done) => {
                co(function* () {

                    let response;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "10"});
                    const blogId1 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 2", slug: "blog-2", posts_per_page: "5"});
                    const blogId2 = response._id;

                    yield httpRequest.put(`${ADMIN_URL}/setting`, {front_blog_id: blogId1});

                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
                    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, published_date: tomorrow});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, is_draft: false, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId1, is_draft: true, published_date: yesterday});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 6", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 7", slug:"post", content: "Test", blog_id: blogId2, published_date: yesterday});

                    let posts;

                    posts = yield httpRequest.get(`${PUBLIC_URL}/posts`);
                    expect(posts.items.length).to.equal(3);
                    expect(posts.items[0].title).to.equal("Post 2");
                    expect(posts.items[1].title).to.equal("Post 4");
                    expect(posts.items[2].title).to.equal("Post 6");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return public posts on non-first pages of a blog', (done) => {
                co(function* () {

                    let response;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "10"});
                    const blogId1 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 2", slug: "blog-2", posts_per_page: "5"});
                    const blogId2 = response._id;

                    yield httpRequest.put(`${ADMIN_URL}/setting`, {front_blog_id: blogId1});

                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
                    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));

                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, published_date: tomorrow});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, is_draft: false, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId1, is_draft: true, published_date: yesterday});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 6", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 7", slug:"post", content: "Test", blog_id: blogId2, published_date: yesterday});

                    let posts;

                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/posts/page/1`);
                    expect(posts.items.length).to.equal(3);
                    expect(posts.items[0].title).to.equal("Post 2");
                    expect(posts.items[1].title).to.equal("Post 4");
                    expect(posts.items[2].title).to.equal("Post 6");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/posts/page/2`);
                    expect(posts.items.length).to.equal(0);

                    posts = yield httpRequest.get(`${PUBLIC_URL}/posts/page/1`);
                    expect(posts.items.length).to.equal(3);
                    expect(posts.items[0].title).to.equal("Post 2");
                    expect(posts.items[1].title).to.equal("Post 4");
                    expect(posts.items[2].title).to.equal("Post 6");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/posts/page/2`);
                    expect(posts.items.length).to.equal(0);

                    yield httpRequest.put(`${ADMIN_URL}/blogs/${blogId1}`, {posts_per_page: 2});
                    posts = yield httpRequest.get(`${PUBLIC_URL}/posts`);
                    expect(posts.items.length).to.equal(2);
                    expect(posts.items[0].title).to.equal("Post 2");
                    expect(posts.items[1].title).to.equal("Post 4");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/posts/page/2`);
                    expect(posts.items.length).to.equal(1);
                    expect(posts.items[0].title).to.equal("Post 6");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return public posts with a specific category', (done) => {
                co(function* () {

                    let response;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "10"});
                    const blogId1 = response._id;

                    yield httpRequest.put(`${ADMIN_URL}/setting`, {front_blog_id: blogId1});

                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

                    response = yield httpRequest.post(`${ADMIN_URL}/categories`, {name: "Category 1", slug: "category-1"});
                    const categoryId1 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/categories`, {name: "Category 2", slug: "category-2"});
                    const categoryId2 = response._id;

                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, category_id: categoryId1});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, category_id: categoryId1});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, is_draft: false, published_date: yesterday, category_id: categoryId1});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId1, is_draft: true, published_date: yesterday, category_id: categoryId1});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 6", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, category_id: categoryId1});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 7", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, category_id: categoryId2});

                    let posts;
                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/category/category-1/posts`);
                    expect(posts.items.length).to.equal(4);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");
                    expect(posts.items[2].title).to.equal("Post 4");
                    expect(posts.items[3].title).to.equal("Post 6");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/category/category-1/posts/page/1`);
                    expect(posts.items.length).to.equal(4);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");
                    expect(posts.items[2].title).to.equal("Post 4");
                    expect(posts.items[3].title).to.equal("Post 6");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/category/category-1/posts/page/2`);
                    expect(posts.items.length).to.equal(0);

                    posts = yield httpRequest.get(`${PUBLIC_URL}/category/category-1/posts`);
                    expect(posts.items.length).to.equal(4);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");
                    expect(posts.items[2].title).to.equal("Post 4");
                    expect(posts.items[3].title).to.equal("Post 6");

                    yield httpRequest.put(`${ADMIN_URL}/blogs/${blogId1}`, {posts_per_page: 2});
                    posts = yield httpRequest.get(`${PUBLIC_URL}/category/category-1/posts`);
                    expect(posts.items.length).to.equal(2);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/category/category-1/posts/page/2`);
                    expect(posts.items.length).to.equal(2);
                    expect(posts.items[0].title).to.equal("Post 4");
                    expect(posts.items[1].title).to.equal("Post 6");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return public posts with a specific author', (done) => {
                co(function* () {

                    let response;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "10"});
                    const blogId1 = response._id;

                    yield httpRequest.put(`${ADMIN_URL}/setting`, {front_blog_id: blogId1});

                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

                    response = yield httpRequest.post(`${ADMIN_URL}/users`, {email: "e@e.com", display_name: "User 1", slug: "user-1", password: "eeeeeeee"});
                    const userId1 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/users`, {email: "w@w.com", display_name: "User 2", slug: "user-2", password: "wwwwwwww"});
                    const userId2 = response._id;

                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, author_id: userId1});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, author_id: userId1});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, is_draft: false, published_date: yesterday, author_id: userId1});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId1, is_draft: true, published_date: yesterday, author_id: userId1});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 6", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, author_id: userId1});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 7", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, author_id: userId2});

                    let posts;
                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/author/user-1/posts`);
                    expect(posts.items.length).to.equal(4);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");
                    expect(posts.items[2].title).to.equal("Post 4");
                    expect(posts.items[3].title).to.equal("Post 6");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/author/user-1/posts/page/1`);
                    expect(posts.items.length).to.equal(4);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");
                    expect(posts.items[2].title).to.equal("Post 4");
                    expect(posts.items[3].title).to.equal("Post 6");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/author/user-1/posts/page/2`);
                    expect(posts.items.length).to.equal(0);

                    posts = yield httpRequest.get(`${PUBLIC_URL}/author/user-1/posts`);
                    expect(posts.items.length).to.equal(4);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");
                    expect(posts.items[2].title).to.equal("Post 4");
                    expect(posts.items[3].title).to.equal("Post 6");

                    yield httpRequest.put(`${ADMIN_URL}/blogs/${blogId1}`, {posts_per_page: 2});
                    posts = yield httpRequest.get(`${PUBLIC_URL}/author/user-1/posts`);
                    expect(posts.items.length).to.equal(2);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 3");

                    posts = yield httpRequest.get(`${PUBLIC_URL}/author/user-1/posts/page/2`);
                    expect(posts.items.length).to.equal(2);
                    expect(posts.items[0].title).to.equal("Post 4");
                    expect(posts.items[1].title).to.equal("Post 6");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return public posts with a specific tag', (done) => {
                co(function* () {

                    let response;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "10"});
                    const blogId1 = response._id;

                    yield httpRequest.put(`${ADMIN_URL}/setting`, {front_blog_id: blogId1});

                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, tags: ["tag1","tag2"]});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, tags: ["tag2"]});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, is_draft: false, published_date: yesterday, tags: ["tag1","tag2"]});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId1, is_draft: true, published_date: yesterday, tags: ["tag1","tag2"]});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 6", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, tags: []});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 7", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday, tags: ['tag1']});

                    let posts;
                    posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/tag/tag1/posts`);
                    expect(posts.items.length).to.equal(3);
                    expect(posts.items[0].title).to.equal("Post 1");
                    expect(posts.items[1].title).to.equal("Post 4");
                    expect(posts.items[2].title).to.equal("Post 7");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

            it('should return public posts in the order of publish data', (done) => {
                co(function* () {

                    let response;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "10"});
                    const blogId1 = response._id;

                    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
                    const twoDaysAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000) * 2);
                    const threeDaysAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000) * 3);

                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1, published_date: twoDaysAgo});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, published_date: yesterday});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, published_date: tomorrow});
                    /* yes */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, is_draft: false, published_date: threeDaysAgo});
                    /* no  */ yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId1, is_draft: true, published_date: yesterday});

                    let posts = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/posts`);
                    expect(posts.items.length).to.equal(3);
                    expect(posts.items[0].title).to.equal("Post 2");
                    expect(posts.items[1].title).to.equal("Post 1");
                    expect(posts.items[2].title).to.equal("Post 4");

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

        });

        describe('[/blogs/:slug]/categories', () => {

            it('should return all the categories used on the blog posts and the numbers of posts', (done) => {
                co(function* () {
                    let response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 1", slug: "blog-1", posts_per_page: "5"});
                    const blogId1 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 2", slug: "blog-2", posts_per_page: "5"});
                    const blogId2 = response._id;

                    yield httpRequest.put(`${ADMIN_URL}/setting`, {front_blog_id: blogId1});

                    response = yield httpRequest.post(`${ADMIN_URL}/categories`, {name: "Category 1", slug: "category-1"});
                    const categoryId1 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/categories`, {name: "Category 2", slug: "category-2"});
                    const categoryId2 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/categories`, {name: "Category 3", slug: "category-3"});
                    const categoryId3 = response._id;

                    response = yield httpRequest.post(`${ADMIN_URL}/categories`, {name: "Category 4", slug: "category-4"});
                    const categoryId4 = response._id;

                    const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

                    yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 1", slug:"post", content: "Test", blog_id: blogId1, category_id: categoryId1, published_date: yesterday});
                    yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 2", slug:"post", content: "Test", blog_id: blogId1, category_id: categoryId1, published_date: yesterday});
                    yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 3", slug:"post", content: "Test", blog_id: blogId1, category_id: categoryId2, published_date: yesterday});
                    yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 4", slug:"post", content: "Test", blog_id: blogId1, category_id: categoryId3});
                    yield httpRequest.post(`${ADMIN_URL}/posts`, {title: "Post 5", slug:"post", content: "Test", blog_id: blogId2, category_id: categoryId4, published_date: yesterday});

                    //yield httpRequest.post(`${ADMIN_URL}/blogs`, {name: "Blog 3", slug: "blog-3", posts_per_page: "5"});
                    let categories;

                    categories = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-1/categories`);
                    expect(categories.items.length).to.equal(2);
                    expect(categories.items[0].name).to.equal("Category 1");
                    expect(categories.items[0].size).to.equal(2);
                    expect(categories.items[1].name).to.equal("Category 2");
                    expect(categories.items[1].size).to.equal(1);

                    categories = yield httpRequest.get(`${PUBLIC_URL}/blog/blog-2/categories`);
                    expect(categories.items.length).to.equal(1);
                    expect(categories.items[0].name).to.equal("Category 4");
                    expect(categories.items[0].size).to.equal(1);

                    categories= yield httpRequest.get(`${PUBLIC_URL}/categories`);
                    expect(categories.items.length).to.equal(2);
                    expect(categories.items[0].name).to.equal("Category 1");
                    expect(categories.items[0].size).to.equal(2);
                    expect(categories.items[1].name).to.equal("Category 2");
                    expect(categories.items[1].size).to.equal(1);

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

        });

    });

});
