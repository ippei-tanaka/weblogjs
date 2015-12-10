import ServerFacade from '../services/server-facade';
import Adder from './adder';


class PostAdder extends Adder {

    get title() {
        return "Create a New Post";
    }

    get fieldSettings() {
        return {
            title: {
                id: "PostAdderTitleField",
                type: "text",
                label: "Title"
            },

            content: {
                id: "PostAdderContentField",
                type: "textarea",
                label: "Content"
            },

            slug: {
                id: "PostAdderDisplaySlugField",
                type: "text",
                label: "Slug"
            },

            category: {
                type: "select",
                label: "Category",
                list: () => ServerFacade.getCategories().then(
                    users => [{
                        value: "",
                        label: "-----"
                    }].concat(users.map(category => {
                        return {
                            value: category._id,
                            label: category.name
                        }
                    }))
                )
            },

            author: {
                type: "select",
                label: "Author",
                list: () => ServerFacade.getUsers().then(
                    users => [{
                        value: "",
                        label: "-----"
                    }].concat(users.map(user => {
                        return {
                            value: user._id,
                            label: user.display_name
                        }
                    }))
                )
            },

            blog: {
                type: "select",
                label: "Blog",
                list: () => ServerFacade.getBlogs().then(
                    blogs => [{
                        value: "",
                        label: "-----"
                    }].concat(blogs.map(blog => {
                        return {
                            value: blog._id,
                            label: blog.title
                        }
                    }))
                )
            },

            tags: {
                type: "tag-list",
                label: "Tags"
            },

            publish_date: {
                type: "datetime",
                label: "Published Date"
            }
        }
    }

    retrieveModel() {
        return Promise.resolve({
            title: "",
            content: "",
            slug: "",
            category: "",
            author: "",
            blog: "",
            tags: [],
            publish_date: new Date()
        });
    }

    sendToServer(values) {
        var data = {
            title: values.title.trim(),
            content: values.content.trim(),
            slug: values.slug.trim(),
            category: values.category || null,
            author: values.author || null,
            blog: values.blog || null,
            tags: values.tags,
            publish_date: values.publish_date
        };

        return ServerFacade.createPost(data);
    }
}


export default PostAdder;