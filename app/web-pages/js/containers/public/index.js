import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';
import PublicPagination from '../../components/public-pagination';

class PublicIndex extends Component {

    static prepareForPreRendering({actions, params}) {
        return co(function* () {
            const { category, page } = params;
            yield actions.loadPublicPosts({category, page});
            yield actions.loadPublicCategories();
        });
    }

    render() {
        const { publicPost, publicCategory, params } = this.props;
        const categories = publicCategory.toObject();
        const posts = publicPost.get('posts').toArray();

        const page = params.page || 1;
        const totalPages = publicPost.get('totalPages');

        return (
            <div className="module-blog-layout">
                <div className="m-bll-main">
                    {posts.map(post =>
                        <section key={post._id} className="m-bll-section">
                            <PublicPost categories={categories} post={post}/>
                        </section>
                    )}

                    {posts.length === 0 ?
                        <section className="m-bll-section">
                            No posts to show.
                        </section>
                        : null}

                    {posts.length > 0 && totalPages > 1 && page > 0 ?
                        <section className="m-bll-section m-bll-short-section">
                            <PublicPagination totalPages={totalPages}
                                              currentPage={page}
                                              linkBuilder={this._paginationLinkBuilder.bind(this)}/>
                        </section> : null
                    }
                </div>
            </div>
        );
    }

    _paginationLinkBuilder (page) {
        const { params } = this.props;
        const category = params.category;
        const pageParam = page > 1 ? `/page/${page}` : "";
        const categoryParam = category ? `/category/${category}` : "";
        return `${categoryParam}${pageParam}/`;
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object,
            location: React.PropTypes.object
        };
    };

}

export default connect(
    state => ({
        publicPost: state.publicPost,
        publicCategory: state.publicCategory
    }),
    actions
)(PublicIndex);