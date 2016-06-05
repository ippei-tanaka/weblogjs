import co from 'co';
import pluralize from 'pluralize';
import ValidationErrorMap from './validation-error-map';
import PathModel from './path-model';
import { MongoError } from 'mongodb';

const ___PathModels = {};

export default class SchemaModel {

    static get name() {
        return null;
    }

    static get _schema() {
        return null;
    }

    static get _PathModels() {
        if (!___PathModels[this.name]) {
            ___PathModels[this.name] = {};

            for (let path of this._schema) {
                ___PathModels[this.name][path.name] = class extends PathModel {
                    static get _path() {
                        return path;
                    }
                };
            }
        }

        return ___PathModels[this.name];
    }

    static get _operator() {
        return null;
    }

    static findMany({query = {}, sort = {}, limit = 0, skip = 0} = {}) {
        return co(function* () {
            const docs = yield this._operator.findMany(query, sort, limit, skip);
            return docs.map(doc => new this(doc));
        }.bind(this));
    }

    static findOne(query) {
        return co(function* () {
            const doc = yield this._operator.findOne(query);
            return doc ? new this(doc) : null;
        }.bind(this));
    }

    static aggregate(query) {
        return co(function* () {
            return yield this._operator.aggregate(query);
        }.bind(this));
    }

    // TODO catch errors for this._operator.deleteOne
    static deleteOne(query) {
        return co(function* () {
            const _query = (new this(query)).values;
            const result = yield this._operator.deleteOne(_query);
        }.bind(this));
    }

    constructor(values) {
        this._pathModels = this._instantiatePathModelsWithValues(values);
        this._initialRawValues = values;
        this._rawUpdatedValues = {};
        this._rawValues = values;
    }

    get values() {
        const _values = {};
        const projection = this.constructor._schema.projection;

        for (let pathName of Object.keys(this._pathModels)) {

            if (projection[pathName] === false) continue;

            const pathModel = this._pathModels[pathName];
            const value = pathModel.value;

            if (value === undefined) continue;

            _values[pathName] = value;
        }

        return _values;
    }

    get rawValues() {
        return this._rawValues;
    }

    get updated () {
        const idModel = this._pathModels._id;
        return !!idModel && !!idModel.value;
    }

    setValues(values) {
        this._rawValues = Object.assign({}, this._rawValues, values);
        this._rawUpdatedValues = Object.assign({}, this._rawUpdatedValues, values);
        this._pathModels = this._instantiatePathModelsWithValues(this._rawValues);
    }

    save() {
        return co(function* () {
            this._examine();
            let values = yield this._executeHooks();
            return yield this._executeDbOperation(values);
        }.bind(this));
    }

    toJSON() {
        return this.values;
    }

    _examine() {
        const error = {};

        for (let pathName of Object.keys(this._pathModels)) {
            const pathModel = this._pathModels[pathName];

            try {
                pathModel.examine({updated: this.updated});
            } catch (e) {
                error[pathName] = e;
            }
        }

        if (Object.keys(error).length > 0)
            throw new ValidationErrorMap(error);
    }

    _executeHooks() {
        return co(function* () {
            if (!this.updated) {
                return yield this.constructor._schema._preCreate(this.values, this._rawValues);
            } else {
                return yield this.constructor._schema._preUpdate(this.values, this._rawValues, this._initialRawValues, this._rawUpdatedValues);
            }
        }.bind(this)).catch((error) => {
            throw new ValidationErrorMap(error);
        });
    }

    _executeDbOperation(values) {
        return co(function* () {
            if (!this.updated) {
                return yield this.constructor._operator.insertOne(values);
            } else {
                return yield this.constructor._operator.updateOne({_id: values._id}, values);
            }
        }.bind(this)).catch(function (error) {
            if (error instanceof MongoError && error.code === 11000) {
                const match = error.message.match(/\s[\w.]+\$([\w]+)_\d+\s.+\{.+:\s"(.+)"\s\}/);
                const pathName = match[1];
                const value = match[2];
                const errorMap = new ValidationErrorMap();
                errorMap.setError(pathName, [this.constructor._schema.getPath(pathName).uniqueErrorMessageBuilder(value)]);
                throw errorMap;
            }
        }.bind(this));
    }

    _instantiatePathModelsWithValues(values) {
        const pathModels = {};

        for (let path of this.constructor._schema) {
            const value = values[path.name];
            const PathModel = this.constructor._PathModels[path.name];
            pathModels[path.name] = new PathModel(value);
        }

        return pathModels;
    }
}