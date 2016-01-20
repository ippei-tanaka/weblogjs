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



describe('User Manager', () => {

    before(clearDb);
    beforeEach(clearDb);
    after(clearDb);

    it('should return a user by the email', (done) => {
        co(function* () {
            var users = [];
            for (let i = 0; i < 10; i++) {
                let u = yield weblogjs.api.userManager.createRegularUser({
                    email: `test${i}@test.com`,
                    display_name: `Test ${i}`,
                    slug: `slug-${i}`,
                    password: `password${i}`
                });
                users.push(u);
            }

            let user = yield weblogjs.api.userManager.findByEmail(users[0].email);

            expect(user.email).to.equal("test0@test.com");
            expect(user.display_name).to.equal("Test 0");
            expect(user.password).to.equal(undefined);

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

    it('should check whether or not the credential is valid', (done) => {
        co(function* () {
            var users = [];
            for (let i = 0; i < 10; i++) {
                let u = yield weblogjs.api.userManager.createRegularUser({
                    email: `test${i}@test.com`,
                    display_name: `Test ${i}`,
                    slug: `slug-${i}`,
                    password: `password${i}`
                });
                users.push(u);
            }

            let validity1 = yield weblogjs.api.userManager.isValid({
                email: "test5@test.com",
                password: "password5"
            });

            let validity2 = yield weblogjs.api.userManager.isValid({
                email: "something@wrong.com",
                password: "somethingwrong"
            });

            expect(validity1).to.equal(true);
            expect(validity2).to.equal(false);

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

    it('should create the admin user', (done) => {
        co(function* () {
            let admin = yield weblogjs.api.userManager.createAdminUser();

            let user = yield weblogjs.api.userManager.findOne();

            expect(user.email).to.equal(admin.email);
            expect(user.display_name).to.equal(admin.display_name);
            expect(user.slug).to.equal(admin.slug);
            expect(user.password).to.equal(undefined);

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

});
