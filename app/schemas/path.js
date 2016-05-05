export default class Path {

    constructor (name, path) {
        this._name = name;
        this._path = path;
    }

    /**
     * @returns {string}
     * @private
     */
    static _defaultRequiredErrorMessage () {
        return `A ${this.name} is required.`;
    }

    /**
     * @param value
     * @returns {string}
     * @private
     */
    static _defaultUniqueErrorMessage (value) {
        return `The ${this.name}, "${value}", has already been taken.`;
    }

    /**
     * @returns {string}
     */
    get name () {
        return this._name;
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
     * @returns {{cleanValue: *, errors: Array.<string>}}
     */
    examine (value) {
        let cleanValue = null;
        let errors = [];

        if (this.isRequired && this._checkIfEmpty(value)) {
            errors.push(this.getRequiredErrorMessage());
            return { cleanValue, errors };
        }

        cleanValue = this._sanitize(value);
        errors = this._validate(cleanValue);

        return { cleanValue, errors };
    }

    /**
     * @returns {string}
     */
    getRequiredErrorMessage () {
        if (typeof this._path.required === 'function') {
            return this._path.required.call(this);
        } else {
            return Path._defaultRequiredErrorMessage.call(this);
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
            return Path._defaultUniqueErrorMessage.call(this, value);
        }
    }

    /**
     * @param value
     * @returns {boolean}
     * @private
     */
    _checkIfEmpty(value) {
        return value === "" || value === null;
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
     * @returns {Array.<string>}
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

        return messages;
    }
}