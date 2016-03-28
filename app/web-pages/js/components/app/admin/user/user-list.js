import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../partials/list';
import * as userActions from '../../../../action-creators/user';
import { connect } from 'react-redux';
import {
    UNINITIALIZED,
    LOADING_USERS,
    USERS_LOAD_SUCCEEDED,
    USERS_LOAD_FAILED
} from '../../../../constants/user-status';


class UserList extends Component {

    render() {
        const { store, loadUsers } = this.props;
        const status = store.get('status');
        const users = store.get('users').toArray();

        if (status === UNINITIALIZED) {
            loadUsers();
        }

        return <List title={this._title}
                     adderLocation="/admin/users/adder"
                     fields={this._fields}
                     models={users}
                     editorLocationBuilder={id => `/admin/users/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/users/${id}/deleter`}/>;
    }

    get _title() {
        return "User List";
    }

    get _fields() {
        return {
            display_name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            email: {
                label: "Email"
            },

            readable_privileges: {
                label: "Privileges",
                stringify: value =>
                    value.map(p => p.toLowerCase()).join(', ')
            },

            created: {
                label: "Created",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated: {
                label: "Updated",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

}


export default connect(
    state => ({store: state.user}),
    userActions
)(UserList);