import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from '../../../../components/user-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';
import { ADMIN_DIR } from '../../../../constants/config'

class UserEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentWillMount() {
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
        const values = Object.assign({}, editedUser, this.state.values);

        return editedUser ? (
            <div>
                <UserForm title={`Edit the User "${editedUser.display_name}"`}
                          errors={errors}
                          values={values}
                          passwordField={false}
                          onChange={this._onChange.bind(this)}
                          onSubmit={this._onSubmit.bind(this)}
                          onClickBackButton={this._goToListPage.bind(this)}
                          submitButtonLabel="Update"
                />
                <div><Link to={`${ADMIN_DIR}/users/${id}/password-editor`}>Change the password</Link></div>
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The user doesn't exist.</h2>
            </div>
        );
    }

    _onChange (field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit () {
        const { params : {id}, editUser } = this.props;
        editUser(this.state.actionId, {id, data: this.state.values});
    }

    _goToListPage() {
        this.context.history.pushState(null, `${ADMIN_DIR}/users`);
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
        userStore: state.user,
        transactionStore: state.transaction
    }),
    actions
)(UserEditor);
