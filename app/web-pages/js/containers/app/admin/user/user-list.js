import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../../components/list';
import actions from '../../../../actions';
import { connect } from 'react-redux';

class UserList extends Component {

    render() {
        const { userStore } = this.props;
        const users = userStore.toArray();

        return <List title="User List"
                     adderLocation="/admin/users/adder"
                     fields={this._fields}
                     models={users}
                     editorLocationBuilder={id => `/admin/users/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/users/${id}/deleter`}/>;
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
    state => ({userStore: state.user}),
    actions
)(UserList);