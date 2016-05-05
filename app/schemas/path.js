export default class Path {

    constructor (name, path) {
        this._name = name;
        this._path = path;
    }

    get name () {
        return this._name;
    }

    get isUnique () {
        return !!this._path.unique;
    }

    sanitize(value) {
        if (this._path.sanitize) {
            return this._path.sanitize(value);
        }
        return value;
    }

    /**
     * @param value
     * @returns {Array.<string>}
     */
    validate(value) {
        if (this._path.validate) {
            return this._path.validate.call(this, value);
        }
        return [];
    }

    getUniqueErrorMessage (value) {
        if (!this.isUnique) return "";
        return this._path.unique.errorMessage.call(this, value);
    }
}