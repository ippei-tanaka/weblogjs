import React, { Component } from 'react';
import { Link } from 'react-router';
import UserPasswordForm from '../../../components/user-password-form';
import actions from '../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../constants/transaction-status';
import { ADMIN_DIR } from '../../../constants/config'

class UserPasswordEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentDidMount() {
        this.setState({actionId: Symbol()});
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
        const {params: {id}, userStore, transactionStore} = this.props;
        const editedUser = userStore.get(id) || null;
        const transaction = transactionStore.get(this.state.actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const values = this.state.values;

        return editedUser ? (
            <UserPasswordForm title={`Edit the Password for User "${editedUser.display_name}"`}
                              errors={errors}
                              values={values}
                              onChange={this._onChange.bind(this)}
                              onSubmit={this._onSubmit.bind(this)}
                              onClickBackButton={this._goToListPage.bind(this)}
                              submitButtonLabel="Update"
            />
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The user doesn't exist.</h2>
            </div>
        );
    }

    _onChange(field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit() {
        const { params : {id}, editUserPassword } = this.props;
        editUserPassword(this.state.actionId, {id, data: this.state.values});
    }

    _goToListPage() {
        const { params : {id} } = this.props;
        this.context.router.push(`${ADMIN_DIR}/users/${id}/editor`);
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
        userStore: state.user,
        transactionStore: state.transaction
    }),
    actions
)(UserPasswordEditor);
