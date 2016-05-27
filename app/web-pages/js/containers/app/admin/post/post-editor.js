import React, { Component } from 'react';
import { Link } from 'react-router';
import PostForm from '../../../../components/post-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';

class PostEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {},
            actionId: null,
            blogLoadActionId: null,
            categoryLoadActionId: null,
            userLoadActionId: null
        }
    }

    componentWillMount() {
        this.setState({
            actionId: Symbol(),
            blogLoadActionId: Symbol(),
            categoryLoadActionId: Symbol(),
            userLoadActionId: Symbol()
        });
        this.props.loadBlogs(this.state.blogLoadActionId);
        this.props.loadCategories(this.state.categoryLoadActionId);
        this.props.loadUsers(this.state.userLoadActionId);
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.actionId);
        this.props.finishTransaction(this.state.blogLoadActionId);
        this.props.finishTransaction(this.state.categoryLoadActionId);
        this.props.finishTransaction(this.state.userLoadActionId);
    }

    componentWillReceiveProps(props) {
        const transaction = props.transactionStore.get(this.state.actionId);

        if (transaction && transaction.get('status') === RESOLVED) {
            this._goToListPage();
        }
    }

    render() {
        const {params: {id}, postStore, transactionStore, categoryStore, blogStore, userStore} = this.props;
        const editedPost = postStore.get(id) || null;
        const transaction = transactionStore.get(this.state.actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const values = Object.assign({}, editedPost, this.state.values);
        const categoryList = categoryStore.toArray();
        const blogList = blogStore.toArray();
        const userList = userStore.toArray();

        return editedPost ? (
            <div>
                <PostForm title={`Edit the Post "${editedPost.title}"`}
                          errors={errors}
                          values={values}
                          categoryList={categoryList}
                          blogList={blogList}
                          authorList={userList}
                          onChange={this._onChange.bind(this)}
                          onSubmit={this._onSubmit.bind(this)}
                          onClickBackButton={this._goToListPage.bind(this)}
                          submitButtonLabel="Update"
                />
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The post doesn't exist.</h2>
            </div>
        );
    }

    _onChange (field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit () {
        const { params : {id}, editPost } = this.props;
        editPost(this.state.actionId, {id, data: this.state.values});
    }

    _goToListPage () {
        this.context.history.pushState(null, "/admin/posts");
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object
        };
    };

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}

export default connect(
    state => ({
        postStore: state.post,
        blogStore: state.blog,
        userStore: state.user,
        categoryStore: state.category,
        transactionStore: state.transaction
    }),
    actions
)(PostEditor);
