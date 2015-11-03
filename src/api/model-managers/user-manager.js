"use strict";


var User = require('./models/user');
var modelManager = require('./model-manager');
var errors = require('../errors/index');
var config = require('../../config-manager').load();


/**
 * @param {object} userInfo - Information about the user.
 * @param {string} userInfo.email - The email of the user.
 * @param {string} userInfo.password - The password of the user.
 * @param {string} userInfo.display_name - The display name of the user.
 * @returns {Promise}
 */
var create = (userInfo) => new Promise((resolve, reject) => {
    modelManager.create(User,{
        email: userInfo.email,
        display_name: userInfo.display_name,
        password: userInfo.password
    }).then((newUser) => {
        findById(newUser.id).then(resolve).catch(reject);
    }).catch((err) => {
        reject(err);
    });
});


/**
 * @param {object} [options]
 * @param {string} [options.sort] - info for sort. (e.g.) "author asc,datepublished desc"
 * @param {number} [options.limit]
 * @returns {Promise}
 */
var getList = modelManager.getList.bind({}, User, null);


/**
 * @param {string} id - a user id
 * @returns {Promise}
 */
var findById = modelManager.findById.bind({}, User, null);


/**
 * @param {string} id
 * @param {object} userInfo
 * @param {string} [userInfo.email] - The email of the user.
 * @param {string} [userInfo.password] - The password of the user.
 * @param {string} [userInfo.display_name] - The display name of the user.
 * @returns {Promise}
 */
var updateById = (id, userInfo) => {
    return modelManager.updateById(User, id, {
        email: userInfo.email,
        password: userInfo.password,
        display_name: userInfo.display_name
    });
};


/**
 * @param {string} id - a user id
 * @returns {Promise}
 */
var removeById = modelManager.removeById.bind({}, User);



/**
 * @param {object} credential - Credential of the user.
 * @param {string} credential.email - The email of the user.
 * @param {string} credential.password - The password of the user.
 * @returns {Promise}
 */
var isValid = (credential) =>  new Promise((resolve, reject) => {
    User
        .findOne({"email": credential.email})
        .select('password')
        .exec((err, user) => {

            if (err)
                return reject(err);

            if (!user)
                return reject(new errors.WeblogJsAuthError());

            user.verifyPassword(credential.password, (err, isMatch) => {
                if (err || !isMatch)
                    return reject(new errors.WeblogJsAuthError());

                findById(user.id).then(resolve).catch(reject);
            });
        });
});


/**
 * @returns {Promise}
 */
var createAdminUser = () => {
    return create({
        email: config.admin_email,
        password: config.admin_password,
        display_name: "Admin"
    });
};


module.exports = {
    create,
    getList,
    findById,
    updateById,
    isValid,
    removeById,
    createAdminUser
};