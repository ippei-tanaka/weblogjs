import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';

class SinglePage extends Component {

    static prepareForPreRendering({actions, store, params}) {
        return co(function* () {
            yield actions.loadPublicPosts();
            const state = store.getState();
            const blogName = state.publicPage.get('blog').name;
            const post = state.post.get(params.id);
            let postName =  "";

            if (post && post.title && post.slug === params.slug) {
                postName = post.title + " - ";
            }

            return {title: `${postName}${blogName}`}
        });
    }

    render() {

        const { params: {id, slug}, postStore } = this.props;
        let post = postStore.get(id);

        if (!post || !post.title || post.slug !== slug) {
            post = null;
        }

        if (post) {
            post.link = `/p/${post._id}/${post.slug}`;
        }

        return (
            <div className="module-blog-layout">
                <div className="m-bll-main">
                    <section className="m-bll-section">
                        { post ? <PublicPost post={post}/> : <div>No post exists.</div>}
                    </section>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        postStore: state.post
    }),
    actions
)(SinglePage);