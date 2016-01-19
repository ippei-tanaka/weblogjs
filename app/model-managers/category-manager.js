import ModelManager from "./model-manager";
import Category from "../models/category";


class CategoryManager extends ModelManager {

    constructor () {
        super(Category);
    }

    findBySlug(slug) {
        return this.findOne({slug: slug});
    }
}


export default new CategoryManager();