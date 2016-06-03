import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';

class SinglePage extends Component {

    static prepareForPreRendering({params, actions, store}) {
        return this._loadContent({params, actions, store});
    }

    static onEnterRoute({params, actions, store}) {
        this._loadContent({params, actions, store})
            .then(({title}) => {
                document.title = title;
            });
    }

    static _loadContent({params, actions, store}) {
        return co(function* () {
            yield actions.loadPublicFrontBlog();
            yield actions.loadPublicPosts();
            yield actions.loadPublicCategories();
            const state = store.getState();
            const blogName = state.publicBlog.get('name');
            const post = state.publicPost.get('posts').get(params.id);

            let postName = "";
            if (post && post.title && post.slug === params.slug) {
                postName = post.title + " - ";
            }

            return {title: `${postName}${blogName}`}
        });
    }

    render() {

        const { params: {id, slug}, publicPost, publicCategory } = this.props;
        const categories = publicCategory.toObject();
        let post = publicPost.get('posts').get(id);

        if (!post || post.slug !== slug) {
            post = null;
        }

        return (
            <div className="module-blog-layout">
                <div className="m-bll-main">
                    <section className="m-bll-section">
                        { post ? <PublicPost categories={categories} post={post}/> : <div>No post exists.</div>}
                    </section>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        publicPost: state.publicPost,
        publicCategory: state.publicCategory
    }),
    actions
)(SinglePage);