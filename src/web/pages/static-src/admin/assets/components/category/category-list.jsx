import Moment from 'moment';
import List from '../list';
import ServerFacade from '../../services/server-facade';


class CategoryList extends List {

    retrieveModels() {
        return ServerFacade.getCategories();
    }

    get title() {
        return "Category List";
    }

    get fields() {
        return {
            name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            created: {
                label: "Created",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated: {
                label: "Updated",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

}

export default CategoryList;