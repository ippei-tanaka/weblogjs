import ServerFacade from '../services/server-facade';
import Editor from './editor';


class BlogAdder extends Editor {

    get title() {
        return "Create a New Blog";
    }

    get okayButtonLabel() {
        return "Create";
    }

    get fieldSettings() {
        return {
            title: {
                id: "BlogAdderTitleField",
                type: "text",
                label: "Title"
            },

            slug: {
                id: "BlogAdderSlugField",
                type: "text",
                label: "Slug"
            },

            posts_per_page: {
                id: "BlogAdderPostsPerPageField",
                type: "select",
                label: "Posts per Page",
                list: () => Promise.resolve([
                    {
                        value: 5,
                        label: "5 posts"
                    },
                    {
                        value: 10,
                        label: "10 posts"
                    },
                    {
                        value: 15,
                        label: "15 posts"
                    }
                ])
            }
        }
    }

    retrieveModel() {
        return Promise.resolve({
            title: "",
            slug: "",
            posts_per_page: ""
        });
    }

    sendToServer(values) {
        var data = {
            title: values.title.trim(),
            slug: values.slug.trim(),
            posts_per_page: values.posts_per_page
        };

        return ServerFacade.createBlog(data);
    }
}


export default BlogAdder;