import ModelController  from './model-controller';
import BlogList     from '../../components/blog/blog-list';
import BlogAdder    from '../../components/blog/blog-adder';
import BlogEditor   from '../../components/blog/blog-editor';
import BlogDeleter  from '../../components/blog/blog-deleter';


class BlogController extends ModelController {

    get List () {
        return BlogList;
    }

    get Adder () {
        return BlogAdder;
    }

    get Editor () {
        return BlogEditor;
    }

    get Deleter () {
        return BlogDeleter;
    }

    get modelName() {
        return "Blog";
    }

}


export default BlogController;