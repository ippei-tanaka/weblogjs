import ServerFacade from '../services/server-facade';
import CategoryAdder from './category-adder';


class CategoryEditor extends CategoryAdder {

    get title() {
        return "Edit the Category";
    }

    retrieveModel(id) {
        return ServerFacade.getCategory(id).then(data => {
            return {
                name: data.name,
                slug: data.slug
            }
        });
    }

    sendToServer(values, id) {
        var data = {
            name: values.name.trim(),
            slug: values.slug.trim()
        };

        return ServerFacade.updateCategory(id, data);
    }
}


export default CategoryEditor;