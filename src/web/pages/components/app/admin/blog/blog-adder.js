import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import BlogStore from '../../../../stores/blog-store';
import BlogForm from './partials/blog-form';
import hat from 'hat';


var rack = hat.rack();


class BlogAdder extends Page {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        };

        this.token = rack();

        this.callback = this.onStoreChanged.bind(this);
    }

    componentDidMount() {
        BlogStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        BlogStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <BlogForm title={this.title}
                      errors={this.state.errors}
                      values={this.state.values}
                      autoSlugfy={true}
                      onSubmit={this.onSubmit.bind(this)}
                      submitButtonLabel="Create"
                      locationForBackButton="/admin/blogs"
            />
        );
    }

    onSubmit(values) {
        ViewActionCreator.requestCreateBlog({
            token: this.token,
            data: values
        });
    }

    onStoreChanged() {
        var action = BlogStore.latestAction;

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => {
                    s.errors = action.data.errors
                });
            } else {
                this.context.history.pushState(null, "/admin/blogs");
            }
        }
    }

    get title() {
        return "Create a New Blog";
    }

}


export default BlogAdder;