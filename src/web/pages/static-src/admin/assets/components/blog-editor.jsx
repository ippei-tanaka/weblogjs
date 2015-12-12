import ServerFacade from '../services/server-facade';
import BlogAdder from './blog-adder';


class BlogEditor extends BlogAdder {

    get title() {
        return "Edit the Blog";
    }

    get okayButtonLabel() {
        return "Edit";
    }

    retrieveModel(id) {
        return ServerFacade.getBlog(id).then(data => {
            return {
                title: data.title,
                slug: data.slug,
                posts_per_page: data.posts_per_page
            }
        });
    }

    sendToServer(values, id) {
        var data = {
            title: values.title.trim(),
            slug: values.slug.trim(),
            posts_per_page: values.posts_per_page
        };

        return ServerFacade.updateBlog(id, data);
    }
}


export default BlogEditor;