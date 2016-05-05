export default class Path {

    constructor (name, path) {
        this._name = name;
        this._path = path;
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
            errors.push(this._path.required.errorMessage.call(this, value));
            return { cleanValue, errors };
        }

        cleanValue = this._sanitize(value);
        errors = this._validate(cleanValue);

        return { cleanValue, errors };
    }

    /**
     * @param value
     * @returns {string}
     */
    getUniqueErrorMessage (value) {
        if (!this.isUnique) return "";
        return this._path.unique.errorMessage.call(this, value);
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
        return this._path.sanitize
            ? this._path.sanitize.call(this, value)
            : value;
    }

    /**
     * @param value
     * @returns {Array.<string>}
     * @private
     */
    _validate(value) {
        if (this._path.validate) {
            return this._path.validate.call(this, value);
        }
        return [];
    }
}