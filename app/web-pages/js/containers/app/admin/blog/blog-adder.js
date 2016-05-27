import React, { Component } from 'react';
import { Link } from 'react-router';
import BlogForm from '../../../../components/blog-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';
import { ADMIN_DIR } from '../../../../constants/config'

class BlogAdder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentWillMount() {
        this.setState({actionId: Symbol()});
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
        const {transactionStore} = this.props;
        const {values, actionId} = this.state;
        const transaction = transactionStore.get(actionId);
        const errors = transaction ? transaction.get('errors') : {};

        return (
            <BlogForm title="Create a New Blog"
                          errors={errors}
                          values={values}
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
        this.props.createBlog(this.state.actionId, this.state.values);
    }

    _goToListPage() {
        this.context.history.pushState(null, `${ADMIN_DIR}/blogs`);
    }

    static get contextTypes() {
        return {
            history: React.PropTypes.object
        };
    };

}

export default connect(
    state => ({
        transactionStore: state.transaction
    }),
    actions
)(BlogAdder);