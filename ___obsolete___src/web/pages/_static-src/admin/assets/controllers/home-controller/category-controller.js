import ModelController  from './model-controller';
import CategoryList     from '../../components/category/category-list';
import CategoryAdder    from '../../components/category/category-adder';
import CategoryEditor   from '../../components/category/category-editor';
import CategoryDeleter  from '../../components/category/category-deleter';


class CategoryController extends ModelController {

    get List () {
        return CategoryList;
    }

    get Adder () {
        return CategoryAdder;
    }

    get Editor () {
        return CategoryEditor;
    }

    get Deleter () {
        return CategoryDeleter;
    }

    get modelName() {
        return "Category";
    }

}


export default CategoryController;