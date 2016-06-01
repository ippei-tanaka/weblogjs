import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';

class Public extends Component {

    static prepareForPreRendering({actions, store}) {
        return co(function* () {
            yield actions.loadPublicPosts();
            yield actions.loadPublicFrontBlog();
            const publicPageStore = store.getState().publicPage;
            return {title: publicPageStore.get('blog').name}
        });
    }

    componentDidMount() {
        this.props.loadPublicFrontBlog();
        this.props.loadPublicPosts();
    }

    render() {
        const publicPageStore = this.props.publicPageStore;
        const posts = publicPageStore.get('posts');

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
)(Public);