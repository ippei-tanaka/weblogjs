import user from './user-model';
import category from './category-model';
import post from './post-model';
import setting from './setting-model';

const models = {
    [user.name]: user,
    [category.name]: category,
    [post.name]: post,
    [setting.name]: setting
};

class Models {

    *[Symbol.iterator] () {
        for (let name of Object.keys(models)) {
            yield models[name];
        }
    }

    /**
     * @param name
     * @returns {SchemaModel}
     */
    getModel (name) {
        return models[name];
    }
}

export default new Models();