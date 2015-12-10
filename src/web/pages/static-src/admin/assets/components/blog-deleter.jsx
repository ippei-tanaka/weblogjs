import Deleter from './deleter';
import ServerFacade from '../services/server-facade';

class BlogDeleter extends Deleter {

    retrieveLabel(id) {
        return ServerFacade.getBlog(id).then(blog => {
            return blog.title;
        });
    }

    get title() {
        return "Delete Blog";
    }

    deleteModel(id) {
        return ServerFacade.deleteBlog(id);
    }

}


export default BlogDeleter;