"use strict";


var co = require('co');
var errors = require('../errors/index');


/**
 * @param {mongoose.Model} Model
 * @param {object} obj
 * @returns {Promise}
 */
var create = (Model, obj) => new Promise((resolve, reject) => {
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
var getList = (Model, options) => new Promise((resolve, reject) => {

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


/**
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise}
 */
var findById = (Model, id) => new Promise((resolve, reject) => {

    var query = Model.findById(id);

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


var methods = {
    create,
    getList,
    findById,
    findOneBy,
    updateById,
    removeById
};


module.exports = {
    applyTo: function (Model) {
        var obj = {};

        Object.keys(methods).forEach(function (key) {
            obj[key] = methods[key].bind({}, Model);
        });

        return obj;
    },
    methods
};