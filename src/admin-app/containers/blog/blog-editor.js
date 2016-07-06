import React, { Component } from 'react';
import { Link } from 'react-router';
import BlogForm from '../../../react-components/blog-form';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import { ADMIN_DIR } from '../../constants/config'

class BlogEditor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentDidMount() {
        this.setState({actionId: Symbol()});
        this.props.loadBlogs();
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
        const {params: {id}, blogStore, transactionStore} = this.props;
        const editedBlog = blogStore.get(id) || null;
        const transaction = transactionStore.get(this.state.actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const values = Object.assign({}, editedBlog, this.state.values);

        return editedBlog ? (
            <div>
                <BlogForm title={`Edit the Blog "${editedBlog.name}"`}
                          errors={errors}
                          values={values}
                          onChange={this._onChange.bind(this)}
                          onSubmit={this._onSubmit.bind(this)}
                          onClickBackButton={this._goToListPage.bind(this)}
                          submitButtonLabel="Update"
                />
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The blog doesn't exist.</h2>
            </div>
        );
    }

    _onChange (field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit () {
        const { params : {id}, editBlog } = this.props;
        editBlog(this.state.actionId, {id, data: this.state.values});
    }

    _goToListPage() {
        this.context.router.push(`${ADMIN_DIR}/blogs`);
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
        blogStore: state.blog,
        transactionStore: state.transaction
    }),
    actions
)(BlogEditor);
