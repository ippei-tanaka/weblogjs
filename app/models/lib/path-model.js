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
        this._value = value;
    }

    get value () {
        let value;

        try {
            value = this._normalize(this._value);
        } catch (error) {
            value = undefined;
        }

        return value;
    }

    examine ({updated}) {

        const isEmpty = this.constructor._checkIfEmpty(this._value);

        if (isEmpty && !updated && this.constructor._path.isRequiredWhenCreated)
        {
            throw [this.constructor._path.requiredErrorMessageBuilder()];
        }

        if (isEmpty && updated && this.constructor._path.isRequiredWhenUpdated)
        {
            throw [this.constructor._path.requiredErrorMessageBuilder()];
        }

        if (isEmpty) {
            return true;
        }

        try {
            this._normalize(this._value);
        } catch (error) {
            throw [error];
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

    _normalize (value, type) {
        try {
            type = type || this.constructor._path.type;

            if (value === undefined) {
                return undefined;
            }

            if (value === null) {
                return null;
            }

            if (type === TYPES.Integer) {
                const num = Number.parseInt(value);
                if (Number.isNaN(num)) throw null;
                return num;
            }

            if (type === TYPES.ObjectID) {
                return ObjectID(value);
            }

            if (type === TYPES.Date) {
                return new Date(value);
            }

            if (type === TYPES.Boolean) {
                return !!value;
            }

            if (Array.isArray(type)) {
                if (!Array.isArray(value)) throw null;
                return value.map((item) => this._normalize(item, type[0]));
            }

            return String(value);
        } catch (error) {
            throw this.constructor._path.typeErrorMessageBuilder(value);
        }
    }
}

export default PathModel;