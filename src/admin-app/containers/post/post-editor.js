import React, { Component } from 'react';
import { Link } from 'react-router';
import PostForm from '../../../react-components/post-form';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import { ADMIN_DIR } from '../../constants/config'

class PostEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentDidMount() {
        this.setState({actionId: Symbol()});
        this.props.loadPosts();
        this.props.loadBlogs();
        this.props.loadCategories();
        this.props.loadUsers();
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.actionId);
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
        const blogList = blogStore.toArray();
        const userList = userStore.toArray();
        const categoryList = categoryStore.toArray();
        const userMap = userStore.toObject();
        const categoryMap = categoryStore.toObject();

        return editedPost ? (
            <div>
                <PostForm title={`Edit the Post "${editedPost.title}"`}
                          errors={errors}
                          values={values}
                          categoryList={categoryList}
                          authorList={userList}
                          categoryMap={categoryMap}
                          authorMap={userMap}
                          blogList={blogList}
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

    _onChange(field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit() {
        const { params : {id}, editPost } = this.props;
        editPost(this.state.actionId, {id, data: this.state.values});
    }

    _goToListPage() {
        this.context.router.push(`${ADMIN_DIR}/posts`);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object.isRequired
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
