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
        resolve(doc);
    });
});


/**
 * @param {mongoose.Model} Model
 * @param {Array<String>} [populate]
 * @param {Object} [options]
 * @param {String} [options.sort] - info for sort. (e.g.) "author asc,datepublished desc"
 * @param {Number} [options.limit]
 * @param {Number} [options.offset]
 * @returns {Promise}
 */
var getList = (Model, populate, options) => new Promise((resolve, reject) => {
    options = options || {};

    var query = Model.find({}),
        sortInfo = {};

    if (Array.isArray(populate)) {
        populate.forEach((path) => {
            query.populate(path);
        });
    }

    if (options.sort) {

        options.sort.split(',').forEach((info) => {
            let arr = info.split(' '),
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

    if (options.limit) {
        let limit = Number.parseInt(options.limit);
        if (!isNaN(limit)) {
            query.limit(limit);
        }
    }

    if (options.offset) {
        let offset = Number.parseInt(options.offset);
        if (!isNaN(offset)) {
            query.skip(offset);
        }
    }

    query.exec((err, items) => {
        if (err) return reject(err);
        resolve({
            items: items
        });
    });
});


/**
 * @param {mongoose.Model} Model
 * @param {Array<String>} populate
 * @param {string} id
 * @returns {Promise}
 */
var findById = (Model, populate, id) => new Promise((resolve, reject) => {

    var query = Model.findById(id);

    if (Array.isArray(populate)) {
        populate.forEach((path) => {
            query = query.populate(path);
        });
    }

    query.exec((err, doc) => {
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
    findById(Model, null, id).then((doc) => {
        Object.keys(obj).forEach((key) => {
            doc[key] = obj[key];
        });

        doc.save((err) => {
            if (err) return reject(err);
            resolve(doc);
        });
    }).catch(reject);
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
            resolve({});
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