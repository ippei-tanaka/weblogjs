import ModelController  from './model-controller';
import PostList         from '../../components/post-list';
import PostAdder        from '../../components/post-adder';
import PostEditor       from '../../components/post-editor';
import PostDeleter      from '../../components/post-deleter';


class PostController extends ModelController {

    get List () {
        return PostList;
    }

    get Adder () {
        return PostAdder;
    }

    get Editor () {
        return PostEditor;
    }

    get Deleter () {
        return PostDeleter;
    }

    get modelName() {
        return "Post";
    }

}


export default PostController;