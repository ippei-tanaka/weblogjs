"use strict";


var errors = require('../errors/index');


/**
 * @param {mongoose.Model} Model
 * @param {object} obj
 * @returns {Promise}
 */
var create = (Model, obj) => new Promise((resolve, reject) => {
    var doc = new Model(obj);

    doc.save((err) => {
        if (err) return reject(err);
        resolve(doc.toJSON());
    });
});


/**
 * @param {mongoose.Model} Model
 * @param {object} [options]
 * @param {string} [options.sort] - info for sort. (e.g.) "author asc,datepublished desc"
 * @param {number} [options.limit]
 * @returns {Promise}
 */
var getList = (Model, options) => new Promise((resolve, reject) => {
    options = options || {};

    var query = Model.find({}),
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

    query.exec((err, items) => {
        if (err) return reject(err);
        resolve({
            items: items.map((item) => item.toJSON())
        });
    });
});


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
var findById = (Model, id) => new Promise((resolve, reject) => {
    Model.findById(id).exec((err, doc) => {
        if (err) return reject(err);
        resolve(doc);
    });
});


/**
 * @param {mongoose.Model} Model
 * @param {string} path
 * @param {string} value
 * @returns {Promise}
 */
var findOneBy = (Model, path, value) => new Promise((resolve, reject) => {
    Model.findOne({[path]: value}).exec((err, doc) => {
        if (err) return reject(err);
        resolve(doc);
    });
});


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @param {object} obj
 * @returns {Promise}
 */
var updateById = (Model, id, obj) => new Promise((resolve, reject) => {
    Model.findByIdAndUpdate(id, {$set: obj})
        .exec((err, doc) => {
            if (err) return reject(err);
            resolve(doc);
        });
});


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
var removeById = (Model, id) => new Promise((resolve, reject) => {
    Model.remove({_id: id})
        .exec((err) => {
            if (err) return reject(err);
            resolve();
        });
});


module.exports = {
    create,
    getList,
    findById,
    findOneBy,
    updateById,
    removeById
};