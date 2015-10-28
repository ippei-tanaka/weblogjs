"use strict";


var User = require('../models/user');
var errors = require('../errors');


/**
 * @param {object} userInfo - Information about the user.
 * @param {string} userInfo.email - The email of the user.
 * @param {string} userInfo.password - The password of the user.
 * @param {string} userInfo.display_name - The display name of the user.
 * @returns {Promise}
 */
var create = (userInfo) => new Promise((resolve, reject) => {
    var user = new User({
        email: userInfo.email,
        display_name: userInfo.display_name,
        password: userInfo.password
    });

    user.save((err) => {
        if (err) return reject(err);

        User.findById(user.id).exec((err, newUser) => {
            if (err) return reject(err);
            if (!newUser) return reject(new errors.WeblogJsError("couldn't find the user."));
            resolve(newUser.toJSON());
        });
    });
});


/**
 * @param {object} [options]
 * @param {string} [options.sort] - info for sort. (e.g.) "author asc,datepublished desc"
 * @param {number} [options.limit]
 * @returns {Promise}
 */
var getList = (options) => new Promise((resolve, reject) => {
    options = options || {};

    var query = User.find({}),
        sortInfo = {};

    if (options.sort) {

        options.sort.split(',').forEach((info) => {
            var arr = info.split(' '),
                path,
                direction = 0;

            if (arr.length !== 2) {
                return;
            }

            path = arr[0];

            if (arr[1] === "asc") {
                direction = 1;
            } else if (arr[1] === "desc") {
                direction = -1;
            }

            if (direction === 0) {
                return;
            }

            sortInfo[path] = direction;
        });

        query.sort(sortInfo);
    }

    query.exec((err, users) => {
        if (err) return reject(err);
        resolve({
            items: users.map((_user) => _user.toJSON())
        });
    });
});


/**
 * @param {string} id - a user id
 * @returns {Promise}
 */
var findById = (id) => new Promise((resolve, reject) => {
    User.findById(id).exec((err, user) => {
        if (err) return reject(err);

        if (!user)
            return reject(new errors.WeblogJsError("The user doesn't exist."));

        resolve(user);
    });
});


/**
 * @param {string} id
 * @param {object} userInfo
 * @param {string} [userInfo.email] - The email of the user.
 * @param {string} [userInfo.password] - The password of the user.
 * @param {string} [userInfo.display_name] - The display name of the user.
 * @returns {Promise}
 */
var updateById = (id, userInfo) => new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, {$set: userInfo}).exec((err, user) => {
        if (err) return reject(err);
        resolve(user);
    });
});


/**
 * @param {string} id - a user id
 * @returns {Promise}
 */
var removeById = (id) => new Promise((resolve, reject) => {
    User.remove({_id: id}).exec((err) => {
        if (err) return reject(err);
        resolve();
    });
});


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
                return reject(new errors.WeblogJsError("The email hasn't been registered or the password is incorrect."));

            user.verifyPassword(credential.password, (err, isMatch) => {
                if (err && !isMatch)
                    return reject(new errors.WeblogJsError("The email hasn't been registered or the password is incorrect."));

                resolve(user.toJSON());
            });
        });
});


module.exports = {
    create,
    getList,
    findById,
    updateById,
    isValid,
    removeById
};