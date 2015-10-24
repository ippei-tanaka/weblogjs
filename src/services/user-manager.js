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
var createUser = (userInfo) => new Promise((resolve, reject) => {
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
 * @returns {Promise}
 */
var getUserList = () => new Promise((resolve, reject) => {
    User.find({}).exec((err, users) => {
        if (err) return reject(err);
        resolve({
            users: users.map((_user) => _user.toJSON())
        });
    });
});


/**
 * @param {object} credential - Credential of the user.
 * @param {string} credential.email - The email of the user.
 * @param {string} credential.password - The password of the user.
 * @returns {Promise}
 */
var isValidUser = (credential) =>  new Promise((resolve, reject) => {

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
    createUser,
    getUserList,
    isValidUser
};