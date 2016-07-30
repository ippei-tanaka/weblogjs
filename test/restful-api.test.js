/* global describe it before beforeEach after afterEach */

import co from 'co';
import {expect} from 'chai';
import httpRequest from './lib/http-request';
import {mongoDriver, mongoDbBaseOperator} from 'simple-odm';

const weblogjs = require('../lib/app');

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

const testPost = Object.freeze({
    "title": "My Post",
    "slug": "my-post",
    "content": "Hello, world!",
    "tags": ["tag1", "tag2", "tag3"],
    "published_date": new Date(),
    "is_draft": false
});

const config = {
    webHost: "localhost",
    webPort: 3004,
    dbName: "weblogjstest",
    adminEmail: admin.email,
    adminPassword: admin.password,
    adminDisplayName: admin.display_name,
    adminSlug: admin.slug,
    adminApiRoot: "/_admin-api"
};

weblogjs.init(config);

const ADMIN_URL = `http://${config.webHost}:${config.webPort}${config.adminApiRoot}`;

const login = () => httpRequest.post(`${ADMIN_URL}/login`, admin);
const logout = () => httpRequest.get(`${ADMIN_URL}/logout`);

const suppressLog = (func) => () =>
{
    const log = console.log;
    console.log = () => {};
    return func().then(() =>
    {
        console.log = log;
    });
};

mongoDriver.setUp({
    database: config.dbName
});

describe('Restful API', function ()
{

    this.timeout(10000);

    before('web server starting', suppressLog(weblogjs.start));
    before('dropping database', suppressLog(mongoDbBaseOperator.dropDatabase));
    beforeEach('emptying collections', suppressLog(mongoDbBaseOperator.removeAllDocuments));
    beforeEach('web server stopping', suppressLog(weblogjs.stop));
    beforeEach('web server starting', suppressLog(weblogjs.start));

    describe('Admin API', () =>
    {

        describe('/home', () =>
        {
            it('should return an empty object', (done) =>
            {
                co(function* ()
                {
                    const obj = yield httpRequest.get(`${ADMIN_URL}/`);
                    expect(Object.keys(obj).length).to.equal(0);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });
        });

        describe('/login', () =>
        {
            it('should give a 401 error if the user try to retrieve restricted data when they haven\'t logged in', (done) =>
            {
                co(function* ()
                {
                    let error;
                    try
                    {
                        yield httpRequest.get(`${ADMIN_URL}/users`);
                    }
                    catch (e)
                    {
                        error = e;
                    }
                    expect(error.response.statusCode).to.equal(401);
                    done();
                }).catch(e =>
                {
                    done(e);
                });
            });

            it('should let the user log in and log out', (done) =>
            {
                co(function* ()
                {
                    yield httpRequest.post(`${ADMIN_URL}/login`, admin);
                    const users = yield httpRequest.get(`${ADMIN_URL}/users`);
                    yield httpRequest.get(`${ADMIN_URL}/logout`);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });
        });

        describe('/users', () =>
        {

            beforeEach('login', () => login());
            afterEach('logout', () => logout());

            it('should return the login user data', (done) =>
            {
                co(function* ()
                {
                    const user = yield httpRequest.get(`${ADMIN_URL}/users/me`);
                    expect(user.email).to.equal(admin.email);
                    expect(user.slug).to.equal(admin.slug);
                    expect(user.display_name).to.equal(admin.display_name);
                    expect(user).to.not.have.property('password');
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should create a new user', (done) =>
            {
                co(function* ()
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    const user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user._id).to.equal(_id);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should return error messages if failing to create a new user', (done) =>
            {
                co(function* ()
                {
                    let errors;

                    try
                    {
                        yield httpRequest.post(`${ADMIN_URL}/users`, {});
                    }
                    catch (e)
                    {
                        errors = e;
                    }

                    expect(errors.body.email[0]).to.equal("The email is required.");
                    expect(errors.body.password[0]).to.equal("The password is required.");
                    expect(errors.body.display_name[0]).to.equal("The display name is required.");
                    expect(errors.body.slug[0]).to.equal("The slug is required.");
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should not include a password in the retrieved user data', (done) =>
            {
                co(function* ()
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    const user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user).to.not.have.property('password');
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should update a user's display name", (done) =>
            {
                co(function* ()
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                    let user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user["display_name"]).to.equal(testUser.display_name);

                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}`, {
                        display_name: "My new name"
                    });

                    user = yield httpRequest.get(`${ADMIN_URL}/users/${_id}`);
                    expect(user["display_name"]).to.equal("My new name");

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should not update a user's password on '/users/:id/' path", (done) =>
            {
                co(function* ()
                {
                    let error;

                    try
                    {
                        const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}`, {
                            password: "NewPassword@@@",
                            password_confirmed: "NewPassword@@@",
                            old_password: testUser.password
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.password[0]).to.equal("The password can't be updated.");

                    done();

                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should not update a user's password unless the confirmed password and their old password is sent", (done) =>
            {
                co(function* ()
                {
                    let error;

                    try
                    {
                        const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "NewPassword@@@"
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.old_password[0]).to.equal('The current password is required.');
                    expect(error.body.password_confirmed[0]).to.equal('The confirmed password is required.');

                    done();

                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should not update a user's password if the new password isn't sent", (done) =>
            {
                co(function* ()
                {
                    let error;

                    try
                    {
                        const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "",
                            password_confirmed: "NewPassword@@@",
                            old_password: testUser.password
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.password[0]).to.equal('The new password is required.');

                    done();

                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should update a user's password if the confirmed password and their old password is sent", (done) =>
            {
                co(function* ()
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                    yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                        password: "NewPassword@@@",
                        password_confirmed: "NewPassword@@@",
                        old_password: testUser.password
                    });

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should return proper error messages when the new password got a validation error", (done) =>
            {
                co(function* ()
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);
                    let error;

                    try
                    {
                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "p ss wo r d",
                            password_confirmed: "",
                            old_password: "Wrong Pass"
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.password[0]).to
                                                  .equal('Only alphabets, numbers and some symbols (#, !, @, %, &, *) are allowed for a password.');
                    expect(error.body.password_confirmed[0]).to.equal('The confirmed password is required.');
                    expect(error.body.old_password[0]).to.equal('The current password sent is not correct.');

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should not update a user's password if their old password is wrong", (done) =>
            {
                co(function* ()
                {

                    let error;

                    try
                    {
                        const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "NewPassword@@@",
                            password_confirmed: "NewPassword@@@",
                            old_password: "WrongPassword"
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.old_password[0]).to.equal('The current password sent is not correct.');

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it("should not update a user's password if the confirmed password is wrong", (done) =>
            {
                co(function* ()
                {

                    let error;

                    try
                    {
                        const {_id} = yield httpRequest.post(`${ADMIN_URL}/users`, testUser);

                        yield httpRequest.put(`${ADMIN_URL}/users/${_id}/password`, {
                            password: "NewPassword@@@",
                            password_confirmed: "qwerqwer",
                            old_password: testUser.password
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.password_confirmed[0]).to
                                                            .equal('The confirmed password sent is not the same as the new password.');

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });
        });

        describe('/categories', () =>
        {

            beforeEach('login', () => login());
            afterEach('logout', () => logout());

            it('should create a new category', (done) =>
            {
                co(function* ()
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                    const category = yield httpRequest.get(`${ADMIN_URL}/categories/${_id}`);
                    expect(category._id).to.be.string;
                    expect(category.name).to.equal(testCategory.name);
                    expect(category.slug).to.equal(testCategory.slug);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should not create a new category when the slug is duplicated', (done) =>
            {
                const cat1 = {name: 'Category Name', slug: 'my0slug1'};
                const cat2 = {name: 'Rondom Name', slug: 'my0slug1'};

                co(function* ()
                {
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                    done(new Error());
                }).catch(() =>
                {
                    done();
                });
            });

            it('should not create a new category if the posted object has an empty value for a required field.', (done) =>
            {
                co(function* ()
                {
                    let error;

                    try
                    {
                        yield httpRequest.post(`${ADMIN_URL}/categories`, {
                            name: '',
                            slug: ''
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.name[0]).to.equal('The name is required.');

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should not create a new category if the posted object has an invalid value.', (done) =>
            {
                co(function* ()
                {
                    let error;

                    try
                    {
                        yield httpRequest.post(`${ADMIN_URL}/categories`, {
                            name: '123456789',
                            slug: 'd d'
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }
                    expect(error.body.slug[0]).to
                                              .equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should partially update a category', (done) =>
            {
                co(function* ()
                {
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
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
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should not update a category when the slug is duplicated.', (done) =>
            {
                co(function* ()
                {
                    let error;

                    try
                    {
                        const cat1 = {name: "Foo", slug: "foo"};
                        const cat2 = {name: "Bar", slug: "bar"};
                        yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                        const id2 = (yield httpRequest.post(`${ADMIN_URL}/categories`, cat2))._id;
                        yield httpRequest.put(`${ADMIN_URL}/categories/${id2}`, {slug: "foo"});
                    }
                    catch (e)
                    {
                        error = e;
                    }
                    expect(error.body.slug[0]).to.equal('The slug, "foo", has already been taken.');

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should not update a category if the posted object is not valid.', (done) =>
            {
                co(function* ()
                {
                    let error;
                    let name = "";

                    while (name.length < 250)
                    {
                        name += "a"
                    }

                    try
                    {
                        const cat = {name: name, slug: "fo o"};
                        yield httpRequest.post(`${ADMIN_URL}/categories`, cat);
                    }
                    catch (e)
                    {
                        error = e;
                    }

                    expect(error.body.slug[0]).to
                                              .equal('Only alphabets, numbers and some symbols (-, _) are allowed for a slug.');

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should delete a category', (done) =>
            {
                const cat1 = {name: "Foo", slug: "foo"};
                const cat2 = {name: "Bar", slug: "bar"};

                co(function* ()
                {
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                    var data1 = yield httpRequest.get(`${ADMIN_URL}/categories`);
                    yield httpRequest.del(`${ADMIN_URL}/categories/${data1.items[0]._id}`);
                    var data2 = yield httpRequest.get(`${ADMIN_URL}/categories`);

                    expect(data1.items).to.have.length(2);
                    expect(data2.items).to.have.length(1);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should return a list of categories', (done) =>
            {
                const cat1 = {name: "Foo", slug: "foo"};
                const cat2 = {name: "Bar", slug: "bar"};
                const cat3 = {name: "Foo Bar", slug: "foobar"};

                co(function* ()
                {
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat1);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat2);
                    yield httpRequest.post(`${ADMIN_URL}/categories`, cat3);
                    var data = yield httpRequest.get(`${ADMIN_URL}/categories`);
                    expect(data.items).to.have.length(3);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should return a category', (done) =>
            {
                co(function* ()
                {
                    const createdCategory = yield httpRequest.post(`${ADMIN_URL}/categories`, testCategory);
                    const retreivedCategory = yield  httpRequest.get(`${ADMIN_URL}/categories/${createdCategory._id}`);
                    expect(retreivedCategory._id).to.equal(createdCategory._id);
                    expect(retreivedCategory.name).to.equal(testCategory.name);
                    expect(retreivedCategory.slug).to.equal(testCategory.slug);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

        });

        describe('/posts', () =>
        {

            beforeEach('login', () => login());
            afterEach('logout', () => logout());

            const createOptionalData = (prefix = "") => co(function* ()
            {

                let result = yield httpRequest.post(`${ADMIN_URL}/users`, {
                    email: `${prefix}test@test.com`,
                    password: "testtest",
                    slug: `${prefix}test-test`,
                    display_name: `${prefix}Test User`
                });

                const user = yield httpRequest.get(`${ADMIN_URL}/users/${result._id}`);

                result = yield httpRequest.post(`${ADMIN_URL}/categories`, {
                    name: `${prefix}Test Category`,
                    slug: `${prefix}test-category`
                });

                const category = yield httpRequest.get(`${ADMIN_URL}/categories/${result._id}`);

                return {
                    author_id: user._id,
                    category_id: category._id
                };
            });

            it('should create a new post', (done) =>
            {
                co(function* ()
                {
                    const options = yield createOptionalData();
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options));
                    yield httpRequest.get(`${ADMIN_URL}/posts/${_id}`);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should return a post', (done) =>
            {
                co(function* ()
                {
                    const options = yield createOptionalData();
                    const {_id} = yield httpRequest.post(`${ADMIN_URL}/posts`, Object.assign({}, testPost, options));
                    const post = yield httpRequest.get(`${ADMIN_URL}/posts/${_id}`);
                    expect(post._id).to.equal(_id);
                    expect(post.title).to.equal(testPost.title);
                    expect(post.slug).to.equal(testPost.slug);
                    expect(post.tags).to.include(testPost.tags[0]);
                    expect(post.tags).to.include(testPost.tags[1]);
                    expect(post.tags).to.include(testPost.tags[2]);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should return type error messages', (done) =>
            {
                co(function* ()
                {
                    let error;
                    try
                    {
                        yield httpRequest.post(`${ADMIN_URL}/posts`, {
                            title: "Hello World",
                            slug: "hello-world",
                            content: "test",
                            author_id: "ddddd"
                        });
                    }
                    catch (e)
                    {
                        error = e;
                    }
                    expect(error.body.author_id[0]).to.equal('The author ID, "ddddd", is invalid.');
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });


            it('should return a list of posts', (done) =>
            {
                co(function* ()
                {
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

                    for (let post of posts)
                    {
                        expect(post._id).to.be.string;
                        expect(post.title).to.equal(testPost.title);
                        expect(post.slug).to.equal(String(count));
                        expect(post.author_id).to.equal(options.author_id);
                        expect(post.category_id).to.equal(options.category_id);
                        count++;
                    }

                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should return a filtered and sorted list of posts', (done) =>
            {
                co(function* ()
                {
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
                }).catch((e) =>
                {
                    done(e);
                });
            });

        });

        describe('/setting', () =>
        {

            beforeEach('login', () => login());
            afterEach('logout', () => logout());

            it('should set a number of posts per a page to the setting', (done) =>
            {
                co(function* ()
                {
                    yield httpRequest.put(`${ADMIN_URL}/setting`, {
                        posts_per_page: 15
                    });
                    const setting = yield httpRequest.get(`${ADMIN_URL}/setting`);
                    expect(setting.posts_per_page).to.equal(15);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });

            it('should return the setting with the default value', (done) =>
            {
                co(function* ()
                {
                    const setting = yield httpRequest.get(`${ADMIN_URL}/setting`);
                    expect(setting.posts_per_page).to.equal(1);
                    done();
                }).catch((e) =>
                {
                    done(e);
                });
            });
        });

    });

});
