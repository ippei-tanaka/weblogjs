import { ValidationError } from '../errors';

export default class ValidationErrorMap {

    constructor() {
        this._errorMap = {};
    }

    /**
     * @param pathName {string}
     * @param errorMessages {string[]}
     */
    addError(pathName, errorMessages) {
        this._errorMap[pathName] = errorMessages.map(msg => new ValidationError(msg));
    }

    isEmpty() {
        return Object.keys(this._errorMap).length === 0
    }

    toJSON() {
        return this._errorMap;
    }
}