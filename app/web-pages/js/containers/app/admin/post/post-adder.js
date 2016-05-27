import React, { Component } from 'react';
import { Link } from 'react-router';
import PostForm from '../../../../components/post-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';
import { ADMIN_DIR } from '../../../../constants/config'

class PostAdder extends Component {

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
        const {transactionStore, categoryStore, blogStore, userStore} = this.props;
        const {values, actionId} = this.state;
        const transaction = transactionStore.get(actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const categoryList = categoryStore.toArray();
        const blogList = blogStore.toArray();
        const userList = userStore.toArray();

        return (
            <PostForm title="Create a New Post"
                      errors={errors}
                      values={values}
                      categoryList={categoryList}
                      blogList={blogList}
                      authorList={userList}
                      onChange={this._onChange.bind(this)}
                      onSubmit={this._onSubmit.bind(this)}
                      onClickBackButton={this._goToListPage.bind(this)}
                      submitButtonLabel="Create"
            />
        );
    }

    _onChange(field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit() {
        this.props.createPost(this.state.actionId, this.state.values);
    }

    _goToListPage() {
        this.context.history.pushState(null, `${ADMIN_DIR}/posts`);
    }

    static get contextTypes() {
        return {
            history: React.PropTypes.object
        };
    };

}

export default connect(
    state => ({
        blogStore: state.blog,
        userStore: state.user,
        categoryStore: state.category,
        transactionStore: state.transaction
    }),
    actions
)(PostAdder);