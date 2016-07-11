import React, { Component } from 'react';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../react-components/public-post';
import PublicPagination from '../../react-components/public-pagination';

class PublicIndex extends Component {

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
            yield actions.loadPublicPosts(params);
            yield actions.loadPublicCategories();
            const state = store.getState();
            const blogName = state.publicBlog.get('name');
            const categoryName = params.category ? params.category + ' - ' : '';
            const tagName = params.tag ? params.tag + ' - ' : '';

            return {title: `${categoryName}${tagName}${blogName}`}
        });
    }

    render() {
        const { publicPost, publicCategory, publicBlog, params } = this.props;
        const categories = publicCategory.toObject();
        const blog = publicBlog.toObject();
        const posts = publicPost.get('posts').toArray();

        const page = params.page || 1;
        const totalPages = publicPost.get('totalPages');

        return (
            <div>
                {posts.map(post =>
                    <section key={post._id} className="module-section">
                        <PublicPost blog={blog} categories={categories} post={post}/>
                    </section>
                )}

                {posts.length === 0 ?
                    <section className="module-section">
                        No posts to show.
                    </section>
                    : null}

                {posts.length > 0 && totalPages > 1 && page > 0 ?
                    <section className="module-section m-sct-short-section">
                        <PublicPagination totalPages={totalPages}
                                          currentPage={page}
                                          linkBuilder={this._paginationLinkBuilder.bind(this)}/>
                    </section> : null
                }
            </div>
        );
    }

    _paginationLinkBuilder(page) {
        const { params : { category, tag } } = this.props;
        const categoryQuery = category ? `/category/${category}` : "";
        const tagQuery = tag ? `/tag/${tag}` : "";
        const pageQuery = page > 1 ? `/page/${page}` : "";
        return `${categoryQuery}${tagQuery}${pageQuery}/`;
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    };
}

export default connect(
    state => ({
        publicPost: state.publicPost,
        publicCategory: state.publicCategory,
        publicBlog: state.publicBlog
    }),
    null
)(PublicIndex);