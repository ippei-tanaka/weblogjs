import React from 'react';
import Layout from './layout';
import PublicPost from '../../react-components/public-post';
import config from "../../config";

const root = config.getValue('publicSiteRoot');

/*
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

        const { params: {slug}, publicSinglePost, publicBlog, publicCategory, publicSiteInfo } = this.props;
        const categories = publicCategory.toObject();
        const rootDir = publicSiteInfo.get('publicDir');
        let post = publicSinglePost.toObject();
        let blog = publicBlog.toObject();

        if (!post || post.slug !== slug) {
            post = null;
        }

        return (
            <section className="module-section">
                { post ? <PublicPost blog={blog} categories={categories} post={post} rootDir={rootDir} /> : <div>No post exists.</div>}
            </section>
        )
    }
}

export default connect(
    state => ({
        publicSinglePost: state.publicSinglePost,
        publicCategory: state.publicCategory,
        publicBlog: state.publicBlog,
        publicSiteInfo: state.publicSiteInfo
    }),
    null
)(SinglePage);
*/

const buildTitle = () => "";
//`${categoryName}${tagName}${blogName}`;

export default ({blog, categories, post}) => (
    <PublicPost blog={blog} categories={categories} post={post} root={root}/>
);