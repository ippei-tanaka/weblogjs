import React from 'react';
import PostStore from '../../../../stores/post-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';
import Confirmation from '../../../partials/confirmation';
import hat from 'hat';

var rack = hat.rack();

class PostDeleter extends Page {

    constructor(props) {
        super(props);

        this.state = {
            values: ""
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
            <div className="module-data-editor">
                <h2 className="m-dte-title">{this.title}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this.onApproved.bind(this)}
                    onCanceled={this.onCanceled.bind(this)}
                >{this.label}</Confirmation>
            </div>
        );
    }

    onApproved () {
        ViewActionCreator.requestDeletePost({
            token: this.token,
            id: this.props.params.id
        });
    }

    onCanceled () {
        this.goToListPage();
    }

    onStoreChanged() {
        var action = PostStore.latestAction;

        this.updateValues();

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => { s.errors = action.data.errors });
            } else {
                this.goToListPage();
            }
        }
    }

    goToListPage () {
        this.context.history.pushState(null, "/admin/posts");
    }

    updateValues () {
        this.setState(s => {
            s.values = PostStore.get(this.props.params.id) || {};
        });
    }

    get title() {
        return `Delete the Post "${this.state.values.title}"`;
    }

    get label() {
        return `Do you want to delete "${this.state.values.title}"?`;
    }
}


export default PostDeleter;