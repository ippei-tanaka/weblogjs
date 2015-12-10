import ServerFacade from '../services/server-facade';
import Adder from './adder';


class CategoryAdder extends Adder {

    get title() {
        return "Create a New Category";
    }

    get fieldSettings() {
        return {
            name: {
                id: "CategoryAdderNameField",
                type: "text",
                label: "Name"
            },

            slug: {
                id: "CategoryAdderSlugField",
                type: "text",
                label: "Slug"
            }
        }
    }

    retrieveModel() {
        return Promise.resolve({
            name: "",
            slug: ""
        });
    }

    sendToServer(values) {
        var data = {
            name: values.name.trim(),
            slug: values.slug.trim()
        };

        return ServerFacade.createCategory(data);
    }
}


export default CategoryAdder;