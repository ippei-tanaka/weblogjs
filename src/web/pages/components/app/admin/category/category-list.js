import Moment from 'moment';
import List from '../../../abstructs/list';
import ServerFacade from '../../../../services/server-facade';


class CategoryList extends List {

    render () {
        this.setPageTitle(this.title);
        return super.render();
    }

    retrieveModels() {
        return ServerFacade.getCategories();
    }

    buildAdderLocation () {
        return "/admin/categories/adder";
    }

    buildEditorLocation (id) {
        return `/admin/categories/${id}/editor`;
    }

    buildDeleterLocation (id) {
        return `/admin/categories/${id}/deleter`;
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

    get title() {
        return "Category List";
    }

}

export default CategoryList;