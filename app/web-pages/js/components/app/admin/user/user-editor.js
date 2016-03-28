import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from './partials/user-form';
import * as userActions from '../../../../action-creators/user';
import * as errorActions from '../../../../action-creators/error';
import { connect } from 'react-redux';
import {
    UNINITIALIZED,
    LOADING_USERS,
    USERS_LOAD_SUCCEEDED,
    USERS_LOAD_FAILED
} from '../../../../constants/user-status';


class UserEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        }
    }

    componentDidMount () {
        const { clearErrors } = this.props;
        clearErrors();
    }

    render() {
        const {
            params : {id},
            editUser,
            userStore,
            errorStore,
            loadUsers
            } = this.props;

        const status = userStore.get('status');

        if (status === UNINITIALIZED) {
            loadUsers();
        }

        let editedUser = userStore.get('users').get(id) || {};

        let errors = errorStore.get('user');

        const values = Object.assign({}, editedUser, this.state.values);

        return (
            <UserForm title={this._createTitle(editedUser.display_name)}
                      errors={errors}
                      values={values}
                      autoSlugfy={false}
                      passwordField={false}
                      onChange={(field, value) => this.setState(state => {state.values[field] = value})}
                      onSubmit={() => editUser({id, data: this.state.values})}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/users"
            />
        );
    }

    _createTitle(username) {
        return `Edit the User "${username}"`;
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}

export default connect(
    state => ({
        userStore: state.user,
        errorStore: state.error
    }),
    Object.assign({}, errorActions, userActions)
)(UserEditor);
