import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../../components/list';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { ADMIN_DIR } from '../../../../constants/config'

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionId: null
        }
    }

    componentWillMount() {
        this.setState({actionId: Symbol()});
        this.props.loadUsers(this.state.actionId);
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.actionId);
    }

    render() {
        const { userStore } = this.props;
        const users = userStore.toArray();

        return <List title="User List"
                     adderLocation={`${ADMIN_DIR}/users/adder`}
                     fields={this._fields}
                     models={users}
                     editorLocationBuilder={id => `${ADMIN_DIR}/users/${id}/editor`}
                     deleterLocationBuilder={id => `${ADMIN_DIR}/users/${id}/deleter`}/>;
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
                label: "Created Date",
                stringify: value =>
                    value ? Moment(value).format("YYYY-MM-DD HH:mm Z") : this.noneElement
            },

            updated_date: {
                label: "Updated Date",
                stringify: value =>
                    value ? Moment(value).format("YYYY-MM-DD HH:mm Z") : this.noneElement
            }
        }
    }

    get noneElement () {
        return <span className="m-dtl-none">(None)</span>;
    }

}


export default connect(
    state => ({userStore: state.user}),
    actions
)(UserList);