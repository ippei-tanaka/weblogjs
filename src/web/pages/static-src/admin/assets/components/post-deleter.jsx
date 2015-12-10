import Deleter from './deleter';
import ServerFacade from '../services/server-facade';

class PostDeleter extends Deleter {

    retrieveLabel(id) {
        return ServerFacade.getPost(id).then(post => {
            return post.title;
        });
    }

    get title() {
        return "Delete Post";
    }

    deleteModel(id) {
        return ServerFacade.deletePost(id);
    }

}


export default PostDeleter;