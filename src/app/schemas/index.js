import co from 'co';
import user from './user';
import category from './category';
import blog from './blog';
import post from './post';
import setting from './setting';

/**
 * @type {Object.<string, WeblogJs_Schema>}
 */
const schemas = {
    [user.name]: user,
    [category.name]: category,
    [blog.name]: blog,
    [post.name]: post,
    [setting.name]: setting
};

class Schemas {

    constructor () {
        this._schemas = schemas;
    }

    *[Symbol.iterator] () {
        for (let name of Object.keys(this._schemas)) {
            yield this._schemas[name];
        }
    }

    /**
     * @param name
     * @returns {WeblogJs_Schema|null}
     */
    getSchema (name) {
        return this._schemas[name] || null;
    }
}

export default new Schemas();