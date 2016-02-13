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
    constructor(props) {
        super(props);

        this.state = {
            values: {}
        }
    }


    componentDidMount() {
        this._updateStoreValues();
        this._updateStateValues();
    }

    componentWillReceiveProps () {
        this._updateStateValues();
    }

    render() {
        const { params : {id}, editUser }  = this.props;
        //let editedUser = store.get('users').find(u => u.get('_id') === id);
        //editedUser = editedUser ? editedUser.toJS() : {};

        return (
            <UserForm title={this._createTitle(this.state.values.display_name)}
                      errors={{}}
                      values={this.state.values}
                      autoSlugfy={false}
                      passwordField={false}
                      onChange={({field, value}) => this.setState(state => {state.values[field] = value})}
                      onSubmit={data => editUser({id, data})}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/users"
            />
        );
    }

    _updateStoreValues () {
        const { store, loadUsers }  = this.props;
        const status = store.get('status');

        if (status === UNINITIALIZED) {
            loadUsers();
        }
    }

    _updateStateValues () {
        const { store, params : {id} }  = this.props;
        let editedUser = store.get('users').find(u => u.get('_id') === id);
        editedUser = editedUser ? editedUser.toJS() : {};
        this.setState(state => { state.values = editedUser });
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
    state => ({store: state.user}),
    userActions
)(UserEditor);
