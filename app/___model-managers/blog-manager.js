import ModelManager from "./model-manager";
import Blog from "./models/blog";


class BlogManager extends ModelManager {

    constructor () {
        super(Blog);
    }

    findBySlug(slug) {
        return this.findOne({slug: slug});
    }
}


export default new BlogManager();