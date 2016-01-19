import React from 'react';
import BlogStore from '../../../../stores/blog-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';
import Confirmation from '../../../partials/confirmation';
import hat from 'hat';

var rack = hat.rack();

class BlogDeleter extends Page {

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
        BlogStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        BlogStore.removeChangeListener(this.callback);
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
        ViewActionCreator.requestDeleteBlog({
            token: this.token,
            id: this.props.params.id
        });
    }

    onCanceled () {
        this.goToListPage();
    }

    onStoreChanged() {
        var action = BlogStore.latestAction;

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
        this.context.history.pushState(null, "/admin/blogs");
    }

    updateValues () {
        this.setState(s => {
            s.values = BlogStore.get(this.props.params.id) || {};
        });
    }

    get title() {
        return `Delete the Blog "${this.state.values.title}"`;
    }

    get label() {
        return `Do you want to delete "${this.state.values.title}"?`;
    }
}


export default BlogDeleter;