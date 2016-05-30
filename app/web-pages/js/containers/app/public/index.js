import React, { Component } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../../components/public/public-post';
import Base62 from 'base62';

class Public extends Component {

    static prepareForPreRendering({actions, store}) {
        return co(function* () {
            // TODO create reducers for public pages. For instance, this-blog-reducer.
            yield actions.loadPublicPosts();
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
        this.props.loadPublicPosts();
        this.props.loadPublicBlogs();
        this.props.loadPublicSetting();
    }

    render() {

        const posts = this.props.postStore.toArray().map(post => {
            return Object.assign({}, post, { link: `/${Base62.encode(post._id)}/${post.slug}` });
        });
        const setting = this.props.settingStore || {};
        const blog = this.props.blogStore.get(setting.front_blog_id);
        const thisBlog = blog || this.props.blogStore.toArray()[0];

        return (
            <div className="module-header-footer-layout">
                <header className="m-hfl-header">
                    <h1><a className="m-hfl-header-link" href="/">{thisBlog.name}</a></h1>
                </header>
                <div className="m-hfl-body">

                    <div className="module-blog-layout">
                        <div className="m-bll-main">
                            {posts.map(post =>
                                <section key={post._id} className="m-bll-section">
                                    <PublicPost post={post} />
                                </section>
                            )}
                            {posts.length === 0 ?
                                <section className="m-bll-section">
                                    No posts to show.
                                </section>
                                : null}
                        </div>
                    </div>

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
        postStore: state.post,
        settingStore: state.setting,
        blogStore: state.blog
    }),
    actions
)(Public);