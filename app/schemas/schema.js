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
    get includedPaths () {
        const obj = {};

        for (let path of this) {
            if (!path.isExcluded) {
                obj[path.name] = true;
            }
        }

        return obj;
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
            const { cleanValue, errors } = path.examine(value);

            if (errors.length > 0) {
                errorMap.addError(path.name, errors);
            } else {
                cleanDoc[path.name] = cleanValue;
            }
        }

        if (doc._id) {
            cleanDoc._id = doc._id;
        }

        return { cleanDoc, errorMap };
    }
}