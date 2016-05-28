import React, { Component } from 'react';
import actions from '../../../actions';
import { connect } from 'react-redux';
import co from 'co';

class Public extends Component {

    static fetchData({actions, store}) {
        return co(function* () {
            yield actions.loadPosts();
            yield actions.loadCategories();
            yield actions.loadBlogs();
            yield actions.loadSetting();
        }.bind(this));
    }

    static getTitle({actions, store}) {
        const state = store.getState();//.user.toArray()[0].display_name;
        const front_id = state.setting.front;
        return `Hey, I am ${front_id}!`;
    }

    componentWillMount () {
        this.props.loadPosts();
        this.props.loadCategories();
        this.props.loadBlogs();
        this.props.loadSetting();
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
        postStore: state.post,
    }),
    actions
)(Public);