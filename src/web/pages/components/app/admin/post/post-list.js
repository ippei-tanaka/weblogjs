import React from 'react';
import Moment from 'moment';
import List from '../../../partials/list';
import PostStore from '../../../../stores/post-store';
import UserStore from '../../../../stores/user-store';
import BlogStore from '../../../../stores/blog-store';
import CategoryStore from '../../../../stores/category-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';


class PostList extends Page {

    constructor(props) {
        super(props);

        this.state = {
            models: [],
            userList: [],
            categoryList: [],
            blogList: []
        };

        this.callback = this.updateModels.bind(this);
    }

    componentDidMount() {
        this.updateModels();
        PostStore.addChangeListener(this.callback);
        UserStore.addChangeListener(this.callback);
        CategoryStore.addChangeListener(this.callback);
        BlogStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        PostStore.removeChangeListener(this.callback);
        UserStore.removeChangeListener(this.callback);
        CategoryStore.removeChangeListener(this.callback);
        BlogStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return <List title={this.title}
                     adderLocation="/admin/posts/adder"
                     fields={this.fields}
                     models={this.state.models}
                     editorLocationBuilder={id => `/admin/posts/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/posts/${id}/deleter`}/>;
    }

    updateModels() {
        this.setState({userList: UserStore.getAll() });
        this.setState({categoryList: CategoryStore.getAll() });
        this.setState({blogList: BlogStore.getAll() });
        this.setState({models: PostStore.getAll()});
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
                        let author = this.state.userList.find(a => value === a._id);
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
                        let category = this.state.categoryList.find(a => value === a._id);
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
                        let blog = this.state.blogList.find(a => value === a._id);
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

    get title() {
        return "Post List";
    }

    get noneElement () {
        return <span className="m-dtl-none">(None)</span>;
    }

    get deletedElement () {
        return <span className="m-dtl-none">(Deleted)</span>;
    }

}

export default PostList;