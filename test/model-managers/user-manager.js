"use strict";

var config = require('../config.json');
var weblogjs = require('../../')(config);
var co = require('co');
var expect = require('chai').expect;


describe('User Manager', () => {

    var clearDb = () => {
        return weblogjs.api.db.dropCollections()
            .catch(() => {
                //console.error(err);
            });
    };

    before(clearDb);
    beforeEach(clearDb);
    after(clearDb);

    it('should return a user by the email', (done) => {
        co(function* () {
            var users = [];
            for (let i = 0; i < 10; i++) {
                let u = yield weblogjs.api.userManager.create({
                    email: `test${i}@test.com`,
                    display_name: `Test ${i}`,
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

    it('should check if the credential is valid', (done) => {
        co(function* () {
            var users = [];
            for (let i = 0; i < 10; i++) {
                let u = yield weblogjs.api.userManager.create({
                    email: `test${i}@test.com`,
                    display_name: `Test ${i}`,
                    password: `password${i}`
                });
                users.push(u);
            }

            let user = yield weblogjs.api.userManager.isValid({
                email: "test5@test.com",
                password: "password5"
            });

            expect(user.email).to.equal("test5@test.com");
            expect(user.display_name).to.equal("Test 5");
            expect(user.password).to.equal(undefined);

            done();
        }).catch((error) => {
            console.error(error);
        })
    });

});
