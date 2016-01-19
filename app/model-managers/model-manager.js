import co from "co";


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


export default class ModelManager {

    constructor (Model) {
        /**
         * @private
         * @type {mongoose.Model}
         */
        this._Model = Model;
    }

    /**
     * @public
     * @param {object} obj
     * @returns {Promise}
     */
    create(obj) {
        var Model = this._Model;
        var doc = new Model(obj);

        return co(function* () {
            yield doc.save();
            return yield this.findById(doc.id);
        }.bind(this));
    }

    /**
     * @public
     * @param {Object} condition
     * @param {QueryOptions} [queryOptions]
     * @returns {Promise}
     */
    find(condition, queryOptions) {
        return new Promise((resolve, reject) => {
            var query = this._Model.find(condition);
            query = addQueryOptions(query, queryOptions);
            query.exec((err, docs) => {
                if (err) return reject(err);
                resolve(docs);
            });
        });
    }

    /**
     * @public
     * @param {Object} condition
     * @param {QueryOptions} [queryOptions]
     * @returns {Promise}
     */
    findOne(condition, queryOptions) {
        return this.find(condition, queryOptions)
            .then((data) => data.length > 0 ? data[0] : null);
    }


    /**
     * @public
     * @param {string} id
     * @returns {Promise}
     */
    findById(id) {
        return this.findOne({_id: id});
    }


    /**
     * @public
     * @param {Object} condition
     * @param {Object} newValues
     * @returns {Promise}
     */
    update(condition, newValues) {

        return this.find(condition).then((docs) => {

            var keys = Object.keys(newValues);

            return co(function* () {
                for (let doc of docs) {
                    for (var key of keys) {
                        doc[key] = newValues[key];
                    }
                    yield doc.save();
                }
                return yield this.find(condition);
            }.bind(this));
        });
    };

    /**
     * @public
     * @param {string} id
     * @param {object} newValues
     * @returns {Promise}
     */
    updateById(id, newValues) {
        return this.update({_id: id}, newValues)
            .then((data) => data ? data[0] : null);
    }

    /**
     * @public
     * @param {Object} condition
     * @returns {Promise}
     */
    remove(condition) {
        return new Promise((resolve, reject) => {
            this._Model.remove(condition).exec((err, docs) => {
                if (err) return reject(err);
                resolve(docs);
            });
        });
    }


    /**
     * @public
     * @param {string} id
     * @returns {Promise}
     */
    removeById(id) {
        return this.remove({_id: id});
    }


    /**
     * @public
     * @param {Object} condition
     * @returns {Promise}
     */
    count (condition) {
        return new Promise((resolve, reject) => {
            this._Model.count(condition).exec((err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
    }

}



/*
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
    */