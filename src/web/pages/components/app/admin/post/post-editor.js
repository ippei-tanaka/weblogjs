import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import PostStore from '../../../../stores/post-store';
import PostForm from './partials/post-form';
import hat from 'hat';


var rack = hat.rack();


class PostEditor extends Page {

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
        PostStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        PostStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <PostForm title={this.title}
                      errors={this.state.errors}
                      values={this.state.values}
                      autoSlugfy={false}
                      onSubmit={this.onSubmit.bind(this)}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/posts"
            />
        );
    }

    onSubmit({updated}) {
        ViewActionCreator.requestUpdatePost({
            id: this.props.params.id,
            token: this.token,
            data: updated
        });
    }

    onStoreChanged() {
        var action = PostStore.latestAction;

        this.updateValues();

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => {
                    s.errors = action.data.errors
                });
            } else {
                this.context.history.pushState(null, "/admin/posts");
            }
        }
    }

    updateValues() {
        this.setState(s => {
            s.values = PostStore.get(this.props.params.id) || {};
        });
    }

    get title() {
        return `Edit the Post "${this.state.values.title}"`;
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}


export default PostEditor;
