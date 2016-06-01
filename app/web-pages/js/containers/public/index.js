import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';

class PublicIndex extends Component {

    static prepareForPreRendering({actions}) {
        return co(function* () {
            yield actions.loadPublicPosts();
        });
    }

    render() {
        const publicPageStore = this.props.publicPageStore;
        const posts = publicPageStore.get('posts').map(post => Object.assign({}, {link: `/p/${post._id}/${post.slug}`}, post));

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
        publicPageStore: state.publicPage
    }),
    actions
)(PublicIndex);