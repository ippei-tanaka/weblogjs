import ValidationErrorMap from './validation-error-map';
import Path from './path';

/**
 * @class
 * @alias WeblogJs_Schema
 */
export default class Schema {

    constructor (name, paths) {
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
    get name () {
        return this._name;
    }

    /**
     * @returns {{}}
     */
    get projection () {
        return {};
    }

    /**
     * @param pathName {string}
     * @returns {Path}
     */
    getPath (pathName) {
        return this._paths[pathName];
    }

    /**
     * @param doc
     * @returns {{cleanDoc: {}, errorMap: ValidationErrorMap}}
     */
    examine (doc) {
        const cleanDoc = {};
        let errorMap = new ValidationErrorMap();

        for (let path of this) {
            const value = doc[path.name];
            const { cleanValue, errorMessages } = path.examine(value);

            if (errorMessages.length > 0) {
                errorMap.setError(path.name, errorMessages);
            } else {
                cleanDoc[path.name] = cleanValue;
            }
        }

        if (doc._id) {
            cleanDoc._id = doc._id;
        }

        return { cleanDoc, errorMap };
    }

    /**
     * @param cleanDoc
     * @param errorMap
     * @returns {Promise.<{cleanDoc: *, errorMap: *}>}
     */
    preInsert({ cleanDoc, errorMap }) {
        return Promise.resolve({ cleanDoc, errorMap });
    }

    /**
     * @param oldDoc
     * @param newValues
     * @param cleanDoc
     * @param errorMap
     * @returns {Promise.<{cleanDoc: *, errorMap: *}>}
     */
    preUpdate ({ oldDoc, newValues, cleanDoc, errorMap }) {
        return Promise.resolve({ cleanDoc, errorMap });
    }
}