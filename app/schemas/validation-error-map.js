import { ValidationError } from '../errors';
import deepcopy from 'deepcopy';

export default class ValidationErrorMap {

    constructor(map = {}) {
        this._errorMap = map;
    }

    /**
     * @param pathName {string}
     * @param errorMessages {Array.<string>}
     */
    setError(pathName, errorMessages) {
        this._errorMap[pathName] = errorMessages.map(msg => new ValidationError(msg));
    }

    /**
     * @param pathName
     */
    removeError (pathName) {
        delete this._errorMap[pathName];
    }

    /**
     * @returns {ValidationErrorMap}
     */
    clone () {
        return new ValidationErrorMap(deepcopy(this._errorMap));
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