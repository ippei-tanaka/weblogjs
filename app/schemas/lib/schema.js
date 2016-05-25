import Path from './path';
import deepcopy from 'deepcopy';
import { ObjectID } from 'mongodb';
import Types from './types';
import co from 'co';

const defaultPath = Object.freeze({
    _id: {
        type: Types.ObjectID
    },
    created_date: {
        type: Types.Date
    },
    updated_date: {
        type: Types.Date
    }
});

/**
 * @class
 * @alias WeblogJs_Schema
 */
export default class Schema {

    constructor(name, paths) {
        this._name = name;
        this._paths = {};

        const _paths = Object.assign({}, defaultPath, paths);

        for (let pathName of Object.keys(_paths)) {
            this._paths[pathName] = new Path(pathName, _paths[pathName]);
        }
    }

    *[Symbol.iterator] () {
        for (let pathName of Object.keys(this._paths)) {
            yield this._paths[pathName];
        }
    }

    /**
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * @returns {{}}
     */
    get projection() {
        const projection = {};

        for (let path of this) {
            projection[path.name] = true;
        }

        return projection;
    }

    /**
     * @param pathName {string}
     * @returns {Path}
     */
    getPath(pathName) {
        return this._paths[pathName];
    }

    _preCreate(doc, rowDoc) {
        const _doc = deepcopy(doc);

        _doc.created_date = new Date();
        _doc.updated_date = null;

        return Promise.resolve(_doc);
    }

    _preUpdate(doc, rowDoc, oldDoc, newValues) {
        const _doc = deepcopy(doc);

        _doc.updated_date = new Date();

        return Promise.resolve(_doc);
    }
}