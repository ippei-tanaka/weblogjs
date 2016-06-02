import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';

class PublicIndex extends Component {

    static prepareForPreRendering({actions, params}) {
        return co(function* () {
            yield actions.loadPublicPosts();
            yield actions.loadPublicCategories();
        });
    }

    render() {
        const { publicPost, publicCategory } = this.props;
        const categories = publicCategory.toObject();
        const posts = publicPost.toArray();

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
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        publicPost: state.publicPost,
        publicCategory: state.publicCategory
    }),
    actions
)(PublicIndex);