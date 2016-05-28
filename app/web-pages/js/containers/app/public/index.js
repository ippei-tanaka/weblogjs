import React, { Component } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import co from 'co';

class Public extends Component {

    static fetchData({actions, store}) {
        return co(function* () {
            yield actions.loadPublicPosts();
        }.bind(this));
    }

    static getTitle({actions, store}) {
        return Promise.resolve(`Hey!`);
    }

    componentWillMount () {
        this.props.loadPublicPosts();
    }

    render() {

        //const users = this.props.userStore.toArray();
        const posts = this.props.postStore.toArray();

        return (
            <div class="module-blog-layout">
                <div class="m-bll-main">
                    { posts.length > 0 ? (
                        <section class="m-bll-section">
                            {posts.length}
                        </section>
                    ) : (
                        <section class="m-bll-section">
                            No posts to show.
                        </section>
                    ) }
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        postStore: state.post
    }),
    actions
)(Public);