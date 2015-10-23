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


describe('weblogjs.blog', () => {

    it('should create a blog', (done) => {
        weblogjs.user.create(testUser)
            .then(() => {
                return weblogjs.blog.create(testUser, testBlog);
            })
            .then(() => {
                return weblogjs.blog.find(testUser, testBlog.name)
            })
            .then((blog) => {
                expect(blog["name"]).to.equal(testBlog.name);
                expect(blog["title"]).to.equal(testBlog.title);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('should not create a blog with a registered name', (done) => {
        weblogjs.user
            .create(testUser)
            .then(() => {
                return weblogjs.blog.create(testUser, testBlog);
            })
            .then(() => {
                return weblogjs.blog.create(testUser, testBlog);
            })
            .catch(() => {
                done();
            });
    });

});
