import ValidationErrorMap from './validation-error-map';
import Path from './path';
import deepcopy from 'deepcopy';
import { ObjectID } from 'mongodb';
import co from 'co';

/**
 * @class
 * @alias WeblogJs_Schema
 */
export default class Schema {

    constructor(name, paths) {
        this._name = name;
        this._paths = {};

        for (let pathName of Object.keys(paths)) {
            this._paths[pathName] = new Path(pathName, paths[pathName]);
        }
    }

    *[Symbol.iterator] () {
        for (let pathName of Object.keys(this._paths)) {
            yield this._paths[pathName];
        }
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @returns {{}}
     */
    get projection() {
        return {};
    }

    /**
     * @param pathName {string}
     * @returns {Path}
     */
    getPath(pathName) {
        return this._paths[pathName];
    }

    createDoc(values) {
        return co(function* () {
            let _values = {};

            for (let path of this) {
                _values[path.name] = values[path.name];
            }

            return yield this._preInsert(this._examine(_values));

        }.bind(this)).catch(errorMap => {
            throw new ValidationErrorMap(errorMap);
        });
    }

    updateDoc(oldDoc, newValues) {
        return co(function* () {
            let _values = {};

            for (let pathName of Object.keys(newValues)) {
                let path = this.getPath(pathName);

                if (!path) continue;

                _values[path.name] = newValues[path.name];
            }

            return yield this._preUpdate(oldDoc, newValues, this._examine(_values));

        }.bind(this)).catch(errorMap => {
            throw new ValidationErrorMap(errorMap);
        });
    }

    convertToType(obj) {
        try {
            return this._convertToType(obj);
        } catch (errorMap) {
            throw new ValidationErrorMap(errorMap);
        }
    }

    _examine(values) {
        const doc = {};
        let convertedValues;
        let errors = {};

        try {
            convertedValues = this._convertToType(values);
        } catch (_errors) {
            errors = Object.assign({}, errors, _errors);
        }

        for (let pathName of Object.keys(convertedValues)) {
            let path = this.getPath(pathName);

            if (!path) continue;

            try {
                doc[path.name] = path.examine(convertedValues[path.name]);
            } catch (errorMessages) {
                errors[path.name] = errorMessages;
            }
        }

        if (values._id) {
            doc._id = values._id;
        }

        if (Object.keys(errors).length > 0) {
            throw errors;
        }

        return doc;
    }

    _convertToType(values) {
        const convertedValues = {};
        let errors = {};

        for (let pathName of Object.keys(values)) {
            let path = this.getPath(pathName);

            if (!path) continue;

            try {
                convertedValues[path.name] = path.convertToType(values[path.name]);
            } catch (errorMessages) {
                errors[path.name] = errorMessages;
            }
        }

        // TODO check if doc._id is valid
        if (values._id) {
            convertedValues._id = new ObjectID(values._id);
        }

        if (Object.keys(errors).length > 0) {
            throw errors;
        }

        return convertedValues;
    }

    _preInsert(doc) {
        const _doc = deepcopy(doc);

        _doc.created_date = new Date();
        _doc.updated_date = null;

        return Promise.resolve(_doc);
    }

    _preUpdate(oldDoc, newValues, doc) {
        const _doc = deepcopy(doc);

        _doc.updated_date = new Date();

        return Promise.resolve(_doc);
    }
}