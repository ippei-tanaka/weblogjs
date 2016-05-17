import { ObjectID } from 'mongodb';

const TYPES = {
    String: "string",
    Integer: "Integer",
    ObjectID: "ObjectID"
};

/**
 * @returns {string}
 */
const requiredErrorDefaultMessage = function () {
    return `A ${this.displayName} is required.`;
};

/**
 * @param value
 * @returns {string}
 */
const uniqueErrorDefaultMessage = function (value) {
    return `The ${this.displayName}, "${value}", has already been taken.`;
};

/**
 * @param value
 * @returns {string}
 */
const typeErrorDefaultMessage = function (value) {
    return `The ${this.displayName}, "${value}", is invalid.`;
};

export default class Path {

    constructor (name, path) {
        this._name = name;
        this._path = path;
    }

    static get Types () {
        return TYPES;
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
        return this._path.display_name || this.name;
    }

    /**
     * @returns {string}
     */
    get type () {
        return this._path.type;
    }

    /**
     * @returns {boolean}
     */
    get isUnique () {
        return !!this._path.unique;
    }

    /**
     * @returns {boolean}
     */
    get isRequired () {
        return !!this._path.required;
    }

    /**
     * @param value
     * @returns {*}
     */
    examine (value) {
        if (this.isRequired && this._checkIfEmpty(value)) {
            throw [this.getRequiredErrorMessage()];
        }

        return this._validate(this._sanitize(value));
    }

    /**
     * @param value
     * @returns {*}
     */
    convertToType(value) {
        try {
            if (this.type === TYPES.Integer) {
                const num = Number.parseInt(value);
                if (Number.isNaN(num)) throw null;
                return num;
            } else if (this.type === TYPES.ObjectID) {
                return ObjectID(value);
            } else {
                return String(value);
            }
        } catch (error) {
            throw [typeErrorDefaultMessage.call(this, value)];
        }
    }

    /**
     * @returns {string}
     */
    getRequiredErrorMessage () {
        if (typeof this._path.required === 'function') {
            return this._path.required.call(this);
        } else {
            return requiredErrorDefaultMessage.call(this);
        }
    }

    /**
     * @param value
     * @returns {string}
     */
    getUniqueErrorMessage (value) {
        if (typeof this._path.unique === 'function') {
            return this._path.unique.call(this, value);
        } else {
            return uniqueErrorDefaultMessage.call(this, value);
        }
    }

    /**
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkIfEmpty(value) {
        return value === "" || value === undefined;
    }

    /**
     * @private
     */
    _sanitize(value) {
        return typeof this._path.sanitize === 'function'
            ? this._path.sanitize.call(this, value)
            : value;
    }

    /**
     * @param value
     * @returns {*}
     * @private
     */
    _validate(value) {
        const messages = [];

        if (typeof this._path.validate === 'function') {
            const iterator = this._path.validate.call(this, value);

            for (let message of iterator) {
                messages.push(message);
            }
        }

        if (messages.length > 0) {
            throw messages;
        }

        return value;
    }
}