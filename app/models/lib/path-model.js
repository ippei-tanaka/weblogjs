import TYPES from '../../schemas/lib/types';
import { ObjectID } from 'mongodb';

class PathModel {

    static get _path () {
        return null;
    }

    static _checkIfEmpty(value) {
        return value === "" || value === undefined;
    }

    constructor (value) {
        this.value = value;
    }

    get value () {
        return this._value;
    }

    set value (value) {
        this._value = this._normalize(value);
    }

    examine () {

        const isEmpty = this.constructor._checkIfEmpty(this._value);

        if (isEmpty && this.constructor._path.isRequired)
        {
            throw [this.constructor._path.requiredErrorMessageBuilder()];
        }

        if (isEmpty) {
            return true;
        }

        const messages = [];
        const iterator = this.constructor._path.validator(this.constructor._path.sanitizer(this._value));

        for (let message of iterator) {
            messages.push(message);
        }

        if (messages.length > 0) {
            throw messages;
        }

        return true;
    }

    _normalize (value) {
        try {
            if (value === undefined) {
                return undefined;
            }

            if (value === null) {
                return null;
            }

            if (this.constructor._path.type === TYPES.Integer) {
                const num = Number.parseInt(value);
                if (Number.isNaN(num)) throw null;
                return num;
            }

            if (this.constructor._path.type === TYPES.ObjectID) {
                return ObjectID(value);
            }

            if (this.constructor._path.type === TYPES.Date) {
                return new Date(value);
            }

            return String(value);
        } catch (error) {
            throw this.constructor._path.typeErrorMessageBuilder(value);
        }
    }
}

export default PathModel;