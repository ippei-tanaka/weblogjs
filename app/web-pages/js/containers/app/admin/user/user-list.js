import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../../components/list';
import actions from '../../../../actions';
import { connect } from 'react-redux';

class UserList extends Component {

    componentDidMount () {
        const { loadUsers } = this.props;
        loadUsers();
    }

    render() {
        const { store } = this.props;
        const users = store.get('users').toArray();

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

            created_date: {
                label: "Created",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated_date: {
                label: "Updated",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

}


export default connect(
    state => ({store: state.user}),
    actions
)(UserList);