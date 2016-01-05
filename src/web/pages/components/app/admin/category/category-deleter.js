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
        return "Delete the Category";
    }

    get pageTitle() {
        return "Delete the Category";
    }

    buildSuccessLocation(id) {
        return "/admin/categories"
    }

    buildCancelLocation(id) {
        return "/admin/categories"
    }

}


export default CategoryDeleter;