"use strict";


var co = require('co');
var errors = require('../errors/index');
var methods = {};

/**
 * @param {mongoose.Model} Model
 * @param {object} obj
 * @returns {Promise}
 */
methods.create = (Model, obj) => new Promise((resolve, reject) => {
    var doc = new Model(obj);

    co(function* () {
        yield doc.save();
        let newDoc = yield Model.findById(doc.id);
        resolve(newDoc);
    }).catch(reject);
});


/**
 * @param {mongoose.Model} Model
 * @param {Object} [options]
 * @param {Array<String>} [options.populate]
 * @param {String} [options.sort] - info for sort. (e.g.) "author asc,datepublished desc"
 * @param {Number} [options.limit]
 * @param {Number} [options.offset]
 * @param {Object} [options.conditions]
 * @returns {Promise}
 */
/*
 methods.getList = (Model, options) => new Promise((resolve, reject) => {

 options = Object.assign({
 sort: "",
 limit: 0,
 offset: 0,
 populate: [],
 conditions: {}
 }, options || {});

 let query = Model.find(options.conditions);

 if (options.populate) {
 options.populate.forEach((path) => {
 query.populate(path);
 });
 }

 if (options.sort) {
 let sortInfo = {};

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

 co(function* () {
 resolve(yield query.exec());
 }).catch(reject);
 });
 */

/**
 * @typedef {Object} QueryOptions
 * @property {String} sort - info for sort. (e.g.) "author asc,datepublished desc"
 * @property {Number} limit
 * @property {Number} offset
 */


/**
 * @param {Object} query
 * @param {QueryOptions} options
 * @returns {Object}
 */
var addQueryOptions = function (query, options) {

    options = Object.assign({
        sort: "",
        limit: 0,
        offset: 0
    }, options || {});

    if (options.sort) {
        let sortInfo = {};

        for (let info of options.sort.split(',')) {
            let arr = info.split(' '),
                path,
                direction = 0;

            if (arr.length !== 2) {
                break;
            }

            path = arr[0];

            if (arr[1] === "asc") {
                direction = 1;
            } else if (arr[1] === "desc") {
                direction = -1;
            }

            if (direction === 0) {
                break;
            }

            sortInfo[path] = direction;
        }

        query.sort(sortInfo);
    }

    if (options.limit) {
        query.limit(options.limit);
    }

    if (options.offset) {
        query.skip(options.offset);
    }

    return query;
};


/**
 * @param {Object} query
 * @param {Array<String>} fields
 * @returns {Object}
 */
var populateFields = function (query, fields) {

    fields = fields || [];

    if (fields) {
        for (let path of fields) {
            query.populate(path);
        }
    }

    return query;
};


/**
 * @param {mongoose.Model} Model
 * @param {Object} condition
 * @param {QueryOptions} [queryOptions]
 * @param {Array<String>} [populatedFields]
 * @returns {Promise}
 */
methods.find = (Model, condition, queryOptions, populatedFields) => new Promise((resolve, reject) => {
    co(function* () {
        var query = Model.find(condition);
        query = addQueryOptions(query, queryOptions);
        query = populateFields(query, populatedFields);
        resolve(yield query.exec());
    }).catch(reject);
});


/**
 * @param {mongoose.Model} Model
 * @param {Object} condition
 * @param {QueryOptions} [queryOptions]
 * @param {Array<String>} [populatedFields]
 * @returns {Promise}
 */
methods.findOne = function (Model, condition, queryOptions, populatedFields) {
    var self = this;
    return new Promise((resolve, reject) => {
        co(function* () {
            var docs = yield self.find(Model, condition, queryOptions, populatedFields);
            resolve(docs[0]);
        }).catch(reject);
    });
};


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
methods.findOneById = function (Model, id) {
    var self = this;
    return new Promise((resolve, reject) => {
        co(function* () {
            resolve(yield self.findOne(Model, {_id: id}));
        }).catch(reject);
    });
};


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @param {object} obj
 * @returns {Promise}
 */
methods.updateById = (Model, id, obj) => new Promise((resolve, reject) => {
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
 * @param {Object} condition
 * @param {Object} newValues
 * @returns {Promise}
 */
methods.update = (Model, condition, newValues) => new Promise((resolve, reject) => {

    co(function* () {

        var docs = yield Model.find(condition);
        var keys = Object.keys(newValues);

        for (let doc of docs) {
            for (var key of keys) {
                doc[key] = newValues[key];
            }
            yield doc.save();
        }

        resolve(yield Model.find(condition));

    }).catch(reject);
});


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
methods.removeById = (Model, id) => new Promise((resolve, reject) => {
    Model.remove({_id: id})
        .exec((err) => {
            if (err) return reject(err);
            resolve({});
        });
});


module.exports = {
    applyTo: function (Model) {
        var obj = {};

        for (let key of Object.keys(methods)) {
            obj[key] = methods[key].bind(methods, Model);
        }

        return obj;
    },
    methods
};