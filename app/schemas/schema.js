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

    get name () {
        return this._name;
    }

    getPath (pathName) {
        return this._paths[pathName];
    }

    sanitize(doc) {
        const cleanDoc = {};

        for (let path of this) {
            cleanDoc[path.name] = path.sanitize(doc[path.name]);
        }

        if (doc._id) {
            cleanDoc._id = doc._id;
        }

        return cleanDoc;
    }

    validate(doc) {
        const errorMap = new ValidationErrorMap();

        for (let path of this) {
            let errorMessages = [];

            errorMessages = path.validate(doc[path.name]);

            if (errorMessages.length > 0) {
                errorMap.addError(path.name, errorMessages);
            }
        }

        if (!errorMap.isEmpty()) {
            return errorMap;
        }

        return null;
    }
}