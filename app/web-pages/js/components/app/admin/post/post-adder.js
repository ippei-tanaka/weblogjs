import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import PostStore from '../../../../stores/post-store';
import PostForm from './partials/post-form';
import hat from 'hat';


var rack = hat.rack();


class PostAdder extends Page {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {
                publish_date: new Date()
            }
        };

        this.token = rack();

        this.callback = this.onStoreChanged.bind(this);
    }

    componentDidMount() {
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
                      autoSlugfy={true}
                      onSubmit={this.onSubmit.bind(this)}
                      submitButtonLabel="Create"
                      locationForBackButton="/admin/posts"
            />
        );
    }

    onSubmit({full}) {
        ViewActionCreator.requestCreatePost({
            token: this.token,
            data: full
        });
    }

    onStoreChanged() {
        var action = PostStore.latestAction;

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

    get title() {
        return "Create a New Post";
    }

}


export default PostAdder;