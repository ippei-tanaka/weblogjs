"use strict";


var User = require('./models/user');
var modelManager = require('./_model-manager');
var config = require('../../config-manager').load();
var errors = require('../errors/index');
var exports = modelManager.applyTo(User);
var co = require('co');

exports.findByEmail = function (email) {
    return this.findOne({email: email});
}.bind(exports);


/**
 * @param {object} credential - Credential of the user.
 * @param {string} credential.email - The email of the user.
 * @param {string} credential.password - The password of the user.
 * @returns {Promise}
 */
exports.isValid = function (credential) {

    var condition = { email: credential.email };
    var options = { select: ["password"] };

    return co(function* () {
        let user = yield this.findOne(condition, options);

        if (!user) {
            throw new errors.WeblogJsAuthError();
        }

        let isMatch = user.verifyPassword(credential.password);

        if (!isMatch) {
            throw new errors.WeblogJsAuthError();
        }

        return this.findById(user.id);
    }.bind(this));
};


/**
 * @returns {Promise}
 */
exports.createAdminUser = function () {
    return this.create({
        email: config.admin_email,
        password: config.admin_password,
        display_name: "Admin"
    });
};


module.exports = exports;