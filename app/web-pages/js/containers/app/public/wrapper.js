import React, { Component } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../../components/public-post';

class Public extends Component {

    static prepareForPreRendering({actions, store}) {
        return co(function* () {
            // TODO create reducers for public pages. For instance, this-blog-reducer.
            yield actions.loadPublicBlogs();
            yield actions.loadPublicSetting();

            const state = store.getState();
            const setting = state.setting || {};
            const front_blog_id = setting.front_blog_id;
            const blog = state.blog;
            let thisBlog;

            if (front_blog_id && blog) {
                thisBlog = blog.get(front_blog_id);
            } else {
                thisBlog = blog.toArray()[0];
            }

            return {title: thisBlog.name}
        });
    }

    componentWillMount() {
        this.props.loadPublicBlogs();
        this.props.loadPublicSetting();
    }

    render() {

        const setting = this.props.settingStore || {};
        const blog = this.props.blogStore.get(setting.front_blog_id);
        let thisBlog = blog || this.props.blogStore.toArray()[0];
        thisBlog = thisBlog || {};

        return (
            <div className="module-header-footer-layout">
                <header className="m-hfl-header">
                    <h1><a className="m-hfl-header-link" href="/">{thisBlog.name}</a></h1>
                </header>
                <div className="m-hfl-body">
                    {this.props.children}
                </div>
                <header className="m-hfl-footer">
                    <span>&copy;{thisBlog.name}</span>
                </header>
            </div>
        );
    }
}

export default connect(
    state => ({
        settingStore: state.setting,
        blogStore: state.blog
    }),
    actions
)(Public);