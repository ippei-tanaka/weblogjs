import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from './partials/user-form';
import * as userActions from '../../../../action-creators/user';
import { connect } from 'react-redux';
import {
    UNINITIALIZED,
    LOADING_USERS,
    USERS_LOAD_SUCCEEDED,
    USERS_LOAD_FAILED
} from '../../../../constants/user-status';


class UserEditor extends Component {

    componentDidMount() {
        const { store, loadUsers }  = this.props;
        const status = store.get('status');

        if (status === UNINITIALIZED) {
            loadUsers();
        }
    }

    render() {
        const { store, params : {id}, editUser }  = this.props;
        let editedUser = store.get('users').find(u => u.get('_id') === id);
        editedUser = editedUser ? editedUser.toJS() : {};

        return (
            <UserForm title={this.createTitle(editedUser.display_name)}
                      errors={{}}
                      values={editedUser}
                      autoSlugfy={false}
                      passwordField={false}
                      onSubmit={data => editUser({id, data})}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/users"
            />
        );
    }

    createTitle(username) {
        return `Edit the User "${username}"`;
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}

export default connect(
    state => ({store: state.user}),
    userActions
)(UserEditor);
