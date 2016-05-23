const requiredErrorDefaultMessage = function () {
    return `A ${this.displayName} is required.`;
};

const uniqueErrorDefaultMessage = function (value) {
    return `The ${this.displayName}, "${value}", has already been taken.`;
};

const typeErrorDefaultMessage = function (value) {
    return `The ${this.displayName}, "${value}", is invalid.`;
};

const defaultSanitizer = (value) => value;

const defaultValidator = function* (value) {};

export default class Path {

    constructor (name, pathObj) {
        this._name = name;
        this._pathObj = pathObj;
    }

    /**
     * @returns {string}
     */
    get name () {
        return this._name;
    }

    /**
     * @returns {string}
     */
    get displayName () {
        return this._pathObj.display_name || this.name;
    }

    /**
     * @returns {string}
     */
    get type () {
        return this._pathObj.type;
    }

    /**
     * @returns {boolean}
     */
    get isUnique () {
        return !!this._pathObj.unique;
    }

    /**
     * @returns {boolean}
     */
    get isRequired () {
        return !!this._pathObj.required;
    }

    get requiredErrorMessageBuilder () {
        if (typeof this._pathObj.required === 'function') {
            return this._pathObj.required.bind(this);
        } else {
            return requiredErrorDefaultMessage.bind(this);
        }
    }

    get uniqueErrorMessageBuilder () {
        if (typeof this._pathObj.unique === 'function') {
            return this._pathObj.unique.bind(this);
        } else {
            return uniqueErrorDefaultMessage.bind(this);
        }
    }

    get typeErrorMessageBuilder () {
        return typeErrorDefaultMessage.bind(this);
    }

    get sanitizer() {
        return typeof this._pathObj.sanitize === 'function'
            ? this._pathObj.sanitize.bind(this)
            : defaultSanitizer;
    }

    get validator() {
        return typeof this._pathObj.validate === 'function'
            ? this._pathObj.validate.bind(this)
            : defaultValidator;
    }
}