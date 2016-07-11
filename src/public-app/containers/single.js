import React, { Component } from 'react';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../react-components/public-post';

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
            yield actions.loadPublicSinglePost({id: params.id});
            yield actions.loadPublicCategories();
            const state = store.getState();
            const blogName = state.publicBlog.get('name');
            const post = state.publicSinglePost.toObject();

            let postName = "";
            if (post && post.title && post.slug === params.slug) {
                postName = post.title + " - ";
            }

            return {title: `${postName}${blogName}`}
        });
    }

    render() {

        const { params: {slug}, publicSinglePost, publicBlog, publicCategory } = this.props;
        const categories = publicCategory.toObject();
        let post = publicSinglePost.toObject();
        let blog = publicBlog.toObject();

        if (!post || post.slug !== slug) {
            post = null;
        }

        return (
            <section className="module-section">
                { post ? <PublicPost blog={blog} categories={categories} post={post}/> : <div>No post exists.</div>}
            </section>
        )
    }
}

export default connect(
    state => ({
        publicSinglePost: state.publicSinglePost,
        publicCategory: state.publicCategory,
        publicBlog: state.publicBlog
    }),
    null
)(SinglePage);