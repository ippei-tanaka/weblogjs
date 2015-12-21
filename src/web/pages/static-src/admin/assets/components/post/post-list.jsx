import Moment from 'moment';
import List from '../list';
import ServerFacade from '../../services/server-facade';
import React from 'react';


class PostList extends List {

    retrieveModels() {
        return ServerFacade.getPosts();
    }

    get initialState () {
        var state = super.initialState;

        state.categories = [];
        state.authors = [];
        state.blogs = [];

        return state;
    }

    componentWillMount() {
        super.componentWillMount();

        ServerFacade.getCategories().then(categories =>
            this.setState(state => { state.categories = categories; }));

        ServerFacade.getUsers().then(users =>
            this.setState(state => { state.authors = users; }));

        ServerFacade.getBlogs().then(blogs =>
            this.setState(state => { state.blogs = blogs; }));
    }

    get title() {
        return "Post List";
    }

    get fields() {
        return {
            title: {
                label: "Title"
            },

            content: {
                label: "Content"
            },

            slug: {
                label: "Slug"
            },

            author: {
                label: "Author",
                stringify: value => {
                    if (!value) {
                        return this.noneElement;
                    } else {
                        let author = this.state.authors.find(a => value === a._id);
                        return author ? author.display_name : this.deletedElement;
                    }
                }
            },

            category: {
                label: "Category",
                stringify: value => {
                    if (!value) {
                        return this.noneElement;
                    } else {
                        let category = this.state.categories.find(a => value === a._id);
                        return category ? category.name : this.deletedElement;
                    }
                }
            },

            blog: {
                label: "Blog",
                stringify: value => {
                    if (!value) {
                        return this.noneElement;
                    } else {
                        let blog = this.state.blogs.find(a => value === a._id);
                        return blog ? blog.title : this.deletedElement;
                    }
                }
            },

            tags: {
                label: "Tags",
                stringify: value => {
                    return value.length > 0 ? value.join(', ') : this.noneElement;
                }
            },

            publish_date: {
                label: "Publish Date",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            is_draft: {
                label: "Is Draft",
                stringify: value => (value === true) ? "Yes" : "No"

            },

            created: {
                label: "Created Date",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated: {
                label: "Updated Date",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

    get noneElement () {
        return <span className="m-dtl-none">(None)</span>;
    }

    get deletedElement () {
        return <span className="m-dtl-none">(Deleted)</span>;
    }
}

export default PostList;