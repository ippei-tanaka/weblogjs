import Deleter from '../../../abstructs/deleter';
import ServerFacade from '../../../../services/server-facade';

class CategoryDeleter extends Deleter {

    retrieveLabel(id) {
        return ServerFacade.getCategory(id).then(category => {
            return category.name;
        });
    }

    deleteModel(id) {
        return ServerFacade.deleteCategory(id);
    }

    get title() {
        return "Delete Category";
    }

    get pageTitle() {
        return "Delete User";
    }

}


export default CategoryDeleter;