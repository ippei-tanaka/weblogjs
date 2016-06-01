import React, { Component } from 'react';
import LoginForm from '../../components/login-form';
import AdminMenu from '../../components/admin-menu';
import Loader from '../../components/loader';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions';
import { LOGOUT_FAILED } from '../../constants/auth-status';


class AdminWrapper extends Component {
    render() {
        const { requestLogout, authStore, children } = this.props;
        const authStatus = authStore.get('status');
        const content = authStatus !== LOGOUT_FAILED ? children : <div>Failed to log out.</div>;
        return (
            <div>
                <AdminMenu onLogoutClick={requestLogout}/>
                {content}
            </div>
        );
    }
}


export default connect(
    state => ({authStore: state.auth}),
    actions
)(AdminWrapper);