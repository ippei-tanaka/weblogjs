import co from 'co';
import user from './user-model';
import category from './category-model';
import blog from './blog-model';
import post from './post-model';

const models = {
    [user.name]: user,
    [category.name]: category,
    [blog.name]: blog,
    [post.name]: post
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