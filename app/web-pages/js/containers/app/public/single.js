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

            return {title: thisBlog.name + " **** "}
        });
    }

    componentWillMount() {
        this.props.loadPublicPosts();
    }

    render() {

        const { params: {id}, postStore } = this.props;
        const post = postStore.get(id);

        if (post) {
            post.link = `/p/${post._id}/${post.slug}`;
        }

        return post ? (
            <div className="module-blog-layout">
                <div className="m-bll-main">
                    <section className="m-bll-section">
                        <PublicPost post={post} />
                    </section>
                </div>
            </div>
        ) : <div>No post exists.</div>;
    }
}

export default connect(
    state => ({
        postStore: state.post
    }),
    actions
)(Public);