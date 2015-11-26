"use strict";


var co = require('co');
var errors = require('../errors/index');
var methods = {};


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
    return this.find(Model, condition, queryOptions, populatedFields)
        .then((data) => data ? data[0] : null);
};


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
methods.findOneById = function (Model, id) {
    return this.findOne(Model, {_id: id});
};


/**
 * @param {mongoose.Model} Model
 * @param {Object} condition
 * @param {Object} newValues
 * @returns {Promise}
 */
methods.update = function (Model, condition, newValues) {

    var self = this;

    return this.find(Model, condition).then((docs) => {

        var keys = Object.keys(newValues);

        return co(function* () {
            for (let doc of docs) {
                for (var key of keys) {
                    doc[key] = newValues[key];
                }
                yield doc.save();
            }
            return yield self.find(Model, condition);
        });
    });
};


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @param {object} newValues
 * @returns {Promise}
 */
methods.updateById = function (Model, id, newValues) {
    return this.update(Model, {_id: id}, newValues)
        .then((data) => data ? data[0] : null);
};


/**
 * @param {mongoose.Model} Model
 * @param {Object} condition
 * @returns {Promise}
 */
methods.remove = (Model, condition) => Model.remove(condition);


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
methods.removeById = function (Model, id) {
    return this.remove(Model, {_id: id});
};


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