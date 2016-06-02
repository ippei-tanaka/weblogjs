import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import { Link } from 'react-router';
import PublicPost from '../../components/public-post';

class PublicWrapper extends Component {

    static prepareForPreRendering({actions, store}) {
        return co(function* () {
            yield actions.loadPublicFrontBlog();
        });
    }

    render() {
        const blogName = this.props.publicBlog.get('name') || "";

        return (
            <div className="module-header-footer-layout">
                <header className="m-hfl-header">
                    <h1><Link className="m-hfl-header-link" to="/">{blogName}</Link></h1>
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
        publicBlog: state.publicBlog
    }),
    actions
)(PublicWrapper);