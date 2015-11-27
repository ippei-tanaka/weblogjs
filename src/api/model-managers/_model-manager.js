"use strict";


var co = require('co');
var errors = require('../errors/index');
var methods = {};


/**
 * @typedef {Object} QueryOptions
 * @property {Object} [sort]
 * @property {Number} [limit]
 * @property {Number} [offset]
 * @property {Array<String>} [populate]
 * @property {Array<String>} [select]
 */


var defaultQueryOptions = Object.freeze({
    sort: {},
    limit: 0,
    offset: 0,
    populate: [],
    select: []
});


/**
 * @param {Object} query
 * @param {QueryOptions} options
 * @returns {Object}
 */
var addQueryOptions = function (query, options) {

    options = Object.assign({}, defaultQueryOptions, options || {});

    for (let path of options.select) {
        query.select(path);
    }

    for (let path of options.populate) {
        query.populate(path);
    }

    query.sort(options.sort);

    query.limit(options.limit);

    query.skip(options.offset);

    return query;
};


/**
 * @param {mongoose.Model} Model
 * @param {object} obj
 * @returns {Promise}
 */
methods.create = function (Model, obj) {
    var doc = new Model(obj);

    return co(function* () {
        yield doc.save();
        return yield this.findById(Model, doc.id);
    }.bind(this));
};

/**
 * @param {mongoose.Model} Model
 * @param {Object} condition
 * @param {QueryOptions} [queryOptions]
 * @returns {Promise}
 */
methods.find = function (Model, condition, queryOptions) {
    var query = Model.find(condition);
    query = addQueryOptions(query, queryOptions);
    return query.exec();
};


/**
 * @param {mongoose.Model} Model
 * @param {Object} condition
 * @param {QueryOptions} [queryOptions]
 * @returns {Promise}
 */
methods.findOne = function (Model, condition, queryOptions) {
    return this.find(Model, condition, queryOptions)
        .then((data) => data ? data[0] : null);
};


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
methods.findById = function (Model, id) {
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