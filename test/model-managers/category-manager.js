"use strict";

var config = require('../config.json');
var weblogjs = require('../../')(config);
var co = require('co');
var expect = require('chai').expect;


describe('Category Manager', () => {

    var clearDb = () => {
        return weblogjs.api.db.dropCollections()
            .catch(() => {
                //console.error(err);
            });
    };

    before(clearDb);
    beforeEach(clearDb);
    after(clearDb);

    it('should create a new category', (done) => {
        co(function* () {
            var category = yield weblogjs.api.categoryManager.create({
                name: "This is a category",
                slug: "this-is-a-category"
            });

            expect(category.name).to.equal("This is a category");
            expect(category.slug).to.equal("this-is-a-category");

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

    it('should return a filtered, sorted list of categories', (done) => {
        co(function* () {
            let randomString = function (length) {
                var charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var text = "";

                for (var i = 0; i < length; i++)
                    text += charList.charAt(Math.floor(Math.random() * charList.length));

                return text;
            };

            for (let i = 0; i < 10; i++) {
                yield weblogjs.api.categoryManager.create({
                    name: "This is a category " + randomString(10),
                    slug: `this-is-a-category-${i}`
                })
            }

            let categories = yield weblogjs.api.categoryManager.find({}, {
                sort: "slug desc"
            });
            expect(categories.length).to.equal(10);
            expect(categories[0].slug).to.equal("this-is-a-category-9");
            expect(categories[9].slug).to.equal("this-is-a-category-0");

            categories = yield weblogjs.api.categoryManager.find({}, {
                sort: "slug asc"
            });
            expect(categories.length).to.equal(10);
            expect(categories[0].slug).to.equal("this-is-a-category-0");
            expect(categories[9].slug).to.equal("this-is-a-category-9");

            categories = yield weblogjs.api.categoryManager.find({}, {
                sort: "slug asc",
                offset: 2,
                limit: 6
            });
            expect(categories.length).to.equal(6);
            expect(categories[0].slug).to.equal("this-is-a-category-2");
            expect(categories[5].slug).to.equal("this-is-a-category-7");

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

    it('should return a category or categories', (done) => {
        co(function* () {
            let category1 = yield weblogjs.api.categoryManager.create({
                name: "This is a category 1",
                slug: `this-is-a-category-1`
            });

            yield weblogjs.api.categoryManager.create({
                name: "This is a category 2",
                slug: `this-is-a-category-2`
            });

            yield weblogjs.api.categoryManager.create({
                name: "This is a category 2",
                slug: `this-is-a-category-2-2`
            });


            let _category = yield weblogjs.api.categoryManager.find({
                name: "This is a category 2"
            });

            expect(_category[0].name).to.equal("This is a category 2");
            expect(_category[1].name).to.equal("This is a category 2");

            _category = yield weblogjs.api.categoryManager.findOne({
                name: "This is a category 1"
            });

            expect(_category.name).to.equal("This is a category 1");
            expect(_category.slug).to.equal("this-is-a-category-1");

             _category = yield weblogjs.api.categoryManager.findOneById(category1.id);

            expect(_category.name).to.equal("This is a category 1");
            expect(_category.slug).to.equal("this-is-a-category-1");

            _category = yield weblogjs.api.categoryManager.findOneBySlug("this-is-a-category-2");

            expect(_category.name).to.equal("This is a category 2");
            expect(_category.slug).to.equal("this-is-a-category-2");

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

    it('should update a category', (done) => {
        co(function* () {
            let category = yield weblogjs.api.categoryManager.create({
                name: "This is a category",
                slug: `this-is-a-category`
            });

            let _categories = yield weblogjs.api.categoryManager.update({_id: category.id}, {
                name: "This is a new category!"
            });

            expect(_categories[0].name).to.equal("This is a new category!");
            expect(_categories[0].slug).to.equal("this-is-a-category");

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

});
