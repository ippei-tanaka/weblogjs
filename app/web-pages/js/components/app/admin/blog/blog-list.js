import React from 'react';
import Moment from 'moment';
import List from '../../../partials/list';
import BlogStore from '../../../../stores/blog-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';


class BlogList extends Page {

    constructor(props) {
        super(props);

        this.state = {
            models: []
        };

        this.callback = this.updateModels.bind(this);
    }

    componentDidMount() {
        this.updateModels();
        BlogStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        BlogStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return <List title={this.title}
                     adderLocation="/admin/blogs/adder"
                     fields={this.fields}
                     models={this.state.models}
                     editorLocationBuilder={id => `/admin/blogs/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/blogs/${id}/deleter`}/>;
    }

    updateModels() {
        this.setState({models: BlogStore.getAll()});
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

    get title() {
        return "Blog List";
    }

}

export default BlogList;