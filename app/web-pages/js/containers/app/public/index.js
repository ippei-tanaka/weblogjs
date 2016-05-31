import React, { Component } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../../components/public-post';

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
    }

    render() {

        const posts = this.props.postStore.toArray().map(post => Object.assign({}, post, { link: `/p/${post._id}/${post.slug}` }));

        return (
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
        );
    }
}

export default connect(
    state => ({
        postStore: state.post
    }),
    actions
)(Public);