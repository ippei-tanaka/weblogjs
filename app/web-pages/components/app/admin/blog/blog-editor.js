import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import BlogStore from '../../../../stores/blog-store';
import BlogForm from './partials/blog-form';
import hat from 'hat';


var rack = hat.rack();


class BlogEditor extends Page {

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
        this.updateValues();
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
                      autoSlugfy={false}
                      onSubmit={this.onSubmit.bind(this)}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/blogs"
            />
        );
    }

    onSubmit(values) {
        ViewActionCreator.requestUpdateBlog({
            id: this.props.params.id,
            token: this.token,
            data: values
        });
    }

    onStoreChanged() {
        var action = BlogStore.latestAction;

        this.updateValues();

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

    updateValues() {
        this.setState(s => {
            s.values = BlogStore.get(this.props.params.id) || {};
        });
    }

    get title() {
        return `Edit the Blog "${this.state.values.display_name}"`;
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}


export default BlogEditor;
