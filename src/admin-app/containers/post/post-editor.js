import React, { Component } from 'react';
import PostForm from '../../components/post-form';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import config from '../../../config';
import showdown from 'showdown';

require('../../../helpers/showdown-codehighlight-extension');

const converter = new showdown.Converter({extensions: ['codehighlight']});
const root = config.getValue('adminSiteRoot');

class PostEditor extends Component {

    constructor (props)
    {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentDidMount ()
    {
        this.setState({actionId: Symbol()});
        this.props.loadPosts();
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
        const {params: {id}, postStore, transactionStore, categoryStore, userStore} = this.props;
        const editedPost = postStore.get(id) || null;
        const transaction = transactionStore.get(this.state.actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const userList = userStore.toArray();
        const categoryList = categoryStore.toArray();
        const userMap = userStore.toObject();
        const categoryMap = categoryStore.toObject();
        const values = Object.assign({}, editedPost, this.state.values);

        values.content_edited = converter.makeHtml(values.content);

        return editedPost ? (
            <div>
                <PostForm title={`Edit the Post "${editedPost.title}"`}
                          errors={errors}
                          values={values}
                          categoryList={categoryList}
                          authorList={userList}
                          categoryMap={categoryMap}
                          authorMap={userMap}
                          onChange={this._onChange.bind(this)}
                          onSubmit={this._onSubmit.bind(this)}
                          onClickBackButton={this._goToListPage.bind(this)}
                          submitButtonLabel="Update"
                          root={root + "/"}
                />
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The post doesn't exist.</h2>
            </div>
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
        const { params : {id}, editPost } = this.props;
        const values = Object.assign({}, this.state.values);
        delete values.content_edited;

        editPost({
            id,
            actionId: this.state.actionId,
            data: values
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

    static get propTypes ()
    {
        return {
            params: React.PropTypes.object.isRequired
        };
    }

}

export default connect(
    state => ({
        authStore: state.auth,
        postStore: state.post,
        userStore: state.user,
        categoryStore: state.category,
        transactionStore: state.transaction
    }),
    actions
)(PostEditor);
