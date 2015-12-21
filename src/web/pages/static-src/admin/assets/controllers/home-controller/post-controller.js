import ModelController  from './model-controller';
import PostList         from '../../components/post/post-list';
import PostAdder        from '../../components/post/post-adder';
import PostEditor       from '../../components/post/post-editor';
import PostDeleter      from '../../components/post/post-deleter';


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