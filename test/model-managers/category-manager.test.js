import configFile from '../config.json';
import WeblogJS from '../..';
import co from 'co';
import { expect } from 'chai';


var weblogjs = WeblogJS(configFile);

var clearDb = () => {
    return weblogjs.api.db.dropCollections()
        .catch(() => {
            //console.error(err);
        });
};



describe('Category Manager', () => {

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
            done(error);
        })
    });

    it('should return a filtered, sorted list of categories', (done) => {
        co(function* () {
            var randomString = function (length) {
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
                sort: { slug: -1 }
            });
            expect(categories.length).to.equal(10);
            expect(categories[0].slug).to.equal("this-is-a-category-9");
            expect(categories[9].slug).to.equal("this-is-a-category-0");

            categories = yield weblogjs.api.categoryManager.find({}, {
                sort: { slug: 1 }
            });
            expect(categories.length).to.equal(10);
            expect(categories[0].slug).to.equal("this-is-a-category-0");
            expect(categories[9].slug).to.equal("this-is-a-category-9");

            categories = yield weblogjs.api.categoryManager.find({}, {
                sort: { slug: 1 },
                offset: 2,
                limit: 6
            });
            expect(categories.length).to.equal(6);
            expect(categories[0].slug).to.equal("this-is-a-category-2");
            expect(categories[5].slug).to.equal("this-is-a-category-7");

            done();
        }).catch((error) => {
            done(error);
        })
    });

    it('should return categories by conditions', (done) => {
        co(function* () {
            var category1 = yield weblogjs.api.categoryManager.create({
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

            var _category = yield weblogjs.api.categoryManager.find({
                name: "This is a category 2"
            });

            expect(_category[0].name).to.equal("This is a category 2");
            expect(_category[1].name).to.equal("This is a category 2");

            _category = yield weblogjs.api.categoryManager.findOne({
                name: "This is a category 1"
            });

            expect(_category.name).to.equal("This is a category 1");
            expect(_category.slug).to.equal("this-is-a-category-1");

             _category = yield weblogjs.api.categoryManager.findById(category1.id);

            expect(_category.name).to.equal("This is a category 1");
            expect(_category.slug).to.equal("this-is-a-category-1");

            _category = yield weblogjs.api.categoryManager.findBySlug("this-is-a-category-2");

            expect(_category.name).to.equal("This is a category 2");
            expect(_category.slug).to.equal("this-is-a-category-2");

            done();
        }).catch((error) => {
            done(error);
        })
    });

    it('should update categories', (done) => {
        co(function* () {

            for (let i = 0; i < 3; i++) {
                yield weblogjs.api.categoryManager.create({
                    name: `# ${i}`,
                    slug: `n-${i}`
                });
            }

            yield weblogjs.api.categoryManager.update({}, {
                name: "new category"
            });

            let categories = yield weblogjs.api.categoryManager.find({}, {
                sort: { slug: 1 }
            });

            for (let i = 0; i < categories.length; i++) {
                expect(categories[i].name).to.equal("new category");
                expect(categories[i].slug).to.equal(`n-${i}`);
            }

            done();
        }).catch((error) => {
            done(error);
        })
    });

    it('should update a category', (done) => {
        co(function* () {

            for (let i = 0; i < 3; i++) {
                yield weblogjs.api.categoryManager.create({
                    name: `# ${i}`,
                    slug: `n-${i}`
                });
            }

            let categories = yield weblogjs.api.categoryManager.find();

            yield weblogjs.api.categoryManager.updateById(categories[2].id, {
                slug: "n-9"
            });

            categories = yield weblogjs.api.categoryManager.find({}, {
                sort: { slug: -1 }
            });

            expect(categories[0].name).to.equal("# 2");
            expect(categories[0].slug).to.equal("n-9");

            done();
        }).catch((error) => {
            done(error);
        })
    });

    it('should remove a category or categories', (done) => {
        co(function* () {

            for (let i = 0; i < 10; i++) {
                yield weblogjs.api.categoryManager.create({
                    name: i < 3 ? "# 0-2" : "# 3-9",
                    slug: `n-${i}`
                });
            }

            let categories = yield weblogjs.api.categoryManager.find();

            expect(categories.length).to.equal(10);

            yield weblogjs.api.categoryManager.remove({
                name: "# 0-2"
            });

            categories = yield weblogjs.api.categoryManager.find();

            expect(categories.length).to.equal(7);

            yield weblogjs.api.categoryManager.removeById(categories[0].id);

            categories = yield weblogjs.api.categoryManager.find();

            expect(categories.length).to.equal(6);

            done();
        }).catch((error) => {
            done(error);
        })
    });
});

export default {};
