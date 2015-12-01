"use strict";

var config = require('../config.json');
var weblogjs = require('../../')(config);
var co = require('co');
var expect = require('chai').expect;


describe('Post Manager', () => {

    var clearDb = () => {
        return weblogjs.api.db.dropCollections()
            .catch(() => {
                //console.error(err);
            });
    };

    before(clearDb);
    beforeEach(clearDb);
    after(clearDb);

    it('should create a new post', (done) => {
        co(function* () {
            var author = yield weblogjs.api.userManager.createRegularUser({
                email: "test@test.com",
                password: "12345678",
                display_name: "Tester"
            });

            var category = yield weblogjs.api.categoryManager.create({
                name: "My Category",
                slug: "12345678"
            });

            var blog = yield weblogjs.api.blogManager.create({
                title: "My Blog",
                slug: "my-blog",
                posts_per_page: 1
            });

            var now = new Date();

            var post = yield weblogjs.api.postManager.create({
                title: "My Title",
                content: "My Content",
                author: author.id,
                publish_date: now,
                category: category.id,
                slug: "my-slug",
                tags: ["My Tag"],
                blog: blog._id
            });

            expect(post.title).to.equal("My Title");
            expect(post.content).to.equal("My Content");
            expect(String(post.author)).to.equal(author.id);
            expect(String(post.category)).to.equal(category.id);
            expect(post.slug).to.equal("my-slug");
            expect(post.publish_date.getTime()).to.equal(now.getTime());
            expect(post.tags.length).to.equal(1);
            expect(post.tags[0]).to.equal("My Tag");

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

});
