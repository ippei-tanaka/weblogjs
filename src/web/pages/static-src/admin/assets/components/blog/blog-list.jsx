import Moment from 'moment';
import List from '../list';
import ServerFacade from '../../services/server-facade';


class BlogList extends List {

    retrieveModels() {
        return ServerFacade.getBlogs();
    }

    get title() {
        return "Blog List";
    }

    get fields() {
        return {
            title: {
                label: "Title"
            },

            slug: {
                label: "Slug"
            },

            posts_per_page: {
                label: "Posts Per Page"
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

export default BlogList;