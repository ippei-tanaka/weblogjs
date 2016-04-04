import React, { Component } from 'react';
import { Link } from 'react-router';
import UserPasswordForm from '../../../../components/user-password-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';

class UserPasswordEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {
                old_password: "",
                new_password: "",
                new_password_confirmed: ""
            },
            values: {
                old_password: "",
                new_password: "",
                new_password_confirmed: ""
            }
        }
    }

    componentWillMount () {
        const { initializeTransaction, loadUsers } = this.props;
        initializeTransaction();
        loadUsers();
    }

    componentWillReceiveProps (props) {
        if (props.transactionStore.get('status') === RESOLVED) {
            this._goToListPage();
        }
    }

    render() {
        const {
            params : {id},
            userStore,
            transactionStore
            } = this.props;
        const editedUser = userStore.get('users').get(id) || null;
        const errors = transactionStore.get('errors');
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

    _onChange (field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit () {
        const { params : {id}, editUser } = this.props;
        //editUser({id, data: this.state.values});
    }

    _goToListPage () {
        const { params : {id} } = this.props;
        this.context.history.pushState(null, `/admin/users/${id}/editor`);
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
)(UserPasswordEditor);
