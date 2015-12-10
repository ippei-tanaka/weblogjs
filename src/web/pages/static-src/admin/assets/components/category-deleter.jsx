import Deleter from './deleter';
import ServerFacade from '../services/server-facade';

class CategoryDeleter extends Deleter {

    retrieveLabel(id) {
        return ServerFacade.getCategory(id).then(category => {
            return category.name;
        });
    }

    get title() {
        return "Delete Category";
    }

    deleteModel(id) {
        return ServerFacade.deleteCategory(id);
    }

}


export default CategoryDeleter;