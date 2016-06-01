import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';

class PublicWrapper extends Component {

    static prepareForPreRendering({actions, store}) {
        return co(function* () {
            yield actions.loadPublicFrontBlog();
            const state = store.getState();
            return {title: state.publicPage.get('blog').name};
        });
    }

    render() {

        const publicPageStore = this.props.publicPageStore;
        const blogName = publicPageStore.get('blog').name || "";

        return (
            <div className="module-header-footer-layout">
                <header className="m-hfl-header">
                    <h1><a className="m-hfl-header-link" href="/">{blogName}</a></h1>
                </header>
                <div className="m-hfl-body">
                    {this.props.children}
                </div>
                <header className="m-hfl-footer">
                    <span>&copy;{blogName}</span>
                </header>
            </div>
        );
    }
}

export default connect(
    state => ({
        publicPageStore: state.publicPage
    }),
    actions
)(PublicWrapper);