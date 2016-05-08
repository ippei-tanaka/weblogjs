import { ValidationError } from '../errors';

export default class ValidationErrorMap {

    constructor() {
        this._errorMap = {};
    }

    /**
     * @param pathName {string}
     * @param errorMessages {Array.<string>}
     */
    setError(pathName, errorMessages) {
        this._errorMap[pathName] = errorMessages.map(msg => new ValidationError(msg));
    }

    removeError (pathName) {
        delete this._errorMap[pathName];
    }

    /**
     * @returns {boolean}
     */
    isEmpty() {
        return Object.keys(this._errorMap).length === 0
    }

    toJSON() {
        return this._errorMap;
    }
}