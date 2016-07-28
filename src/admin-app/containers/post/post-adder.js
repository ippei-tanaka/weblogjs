import React, { Component } from 'react';
import PostForm from '../../components/post-form';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import config from '../../../config';

const root = config.getValue('adminSiteRoot');

class PostAdder extends Component {

    constructor (props)
    {
        super(props);

        const loginUser = props.authStore.get('user');

        this.state = {
            values: {
                published_date: new Date(),
                author_id: loginUser._id
            },
            actionId: null
        }
    }

    componentDidMount ()
    {
        this.setState({actionId: Symbol()});
        this.props.loadCategories();
        this.props.loadUsers();
    }

    componentWillUnmount ()
    {
        this.props.finishTransaction({actionId: this.state.actionId});
    }

    componentWillReceiveProps (props)
    {
        const transaction = props.transactionStore.get(this.state.actionId);

        if (transaction && transaction.get('status') === RESOLVED)
        {
            this._goToListPage();
        }
    }

    render ()
    {
        const {transactionStore, categoryStore, userStore} = this.props;
        const transaction = transactionStore.get(this.state.actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const categoryList = categoryStore.toArray();
        const userList = userStore.toArray();
        const values = this.state.values;
        const userMap = userStore.toObject();
        const categoryMap = categoryStore.toObject();

        return (
            <PostForm title="Create a New Post"
                      errors={errors}
                      values={values}
                      categoryList={categoryList}
                      authorList={userList}
                      categoryMap={categoryMap}
                      authorMap={userMap}
                      onChange={this._onChange.bind(this)}
                      onSubmit={this._onSubmit.bind(this)}
                      onClickBackButton={this._goToListPage.bind(this)}
                      submitButtonLabel="Create"
            />
        );
    }

    _onChange (field, value)
    {
        this.setState(state =>
        {
            state.values[field] = value;
        });
    }

    _onSubmit ()
    {
        this.props.createPost({
            actionId: this.state.actionId,
            data: this.state.values
        });
    }

    _goToListPage ()
    {
        this.context.router.push(`${root}/posts`);
    }

    static get contextTypes ()
    {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

}

export default connect(
    state => ({
        authStore: state.auth,
        userStore: state.user,
        categoryStore: state.category,
        transactionStore: state.transaction
    }),
    actions
)(PostAdder);