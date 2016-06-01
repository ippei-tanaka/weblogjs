import React, { Component } from 'react';
import actions from '../../actions';
import { connect } from 'react-redux';
import co from 'co';
import PublicPost from '../../components/public-post';

class Public extends Component {

    componentDidMount() {
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