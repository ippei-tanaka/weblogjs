import React, { Component } from 'react';
import LoginForm from '../../../components/login-form';
import AdminMenu from '../../../components/admin-menu';
import Loader from '../../../components/loader';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../../actions';
import {
    UNINITIALIZED,
    WAITING_FOR_STATUS_CHECK,
    WAITING_FOR_LOGIN,
    WAITING_FOR_LOGOUT,
    LOGIN_CONFIRMED,
    LOGOUT_CONFIRMED,
    LOGIN_SUCCEEDED,
    LOGIN_FAILED,
    LOGOUT_SUCCEEDED,
    LOGOUT_FAILED
} from '../../../constants/auth-status';


class Admin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    componentDidMount() {
        this.props.checkStatus();
    }

    render() {
        const { requestLogin, requestLogout, auth, children } = this.props;
        const status = auth.get('status');
        const loginFormProps = {
            error: false,
            email: this.state.email,
            password: this.state.password,
            onChange: ({value, field}) => this.setState({[field]: value}),
            onSubmit: () => requestLogin({
                email: this.state.email,
                password: this.state.password
            })
        };
        const menuElement = <AdminMenu onLogoutClick={requestLogout}/>;
        let menu = null;
        let content = null;

        switch (status) {
            case UNINITIALIZED:
            case LOGOUT_CONFIRMED:
            case LOGOUT_SUCCEEDED:
                content = <LoginForm {...loginFormProps} />;
                break;
            case LOGIN_FAILED:
                loginFormProps.error = true;
                content = <LoginForm {...loginFormProps} />;
                break;
            case LOGIN_CONFIRMED:
            case LOGIN_SUCCEEDED:
                menu = menuElement;
                content = children;
                break;
            default:
                content = <Loader />;
                break;
        }

        return (
            <div className="module-admin">
                {menu}
                {content}
            </div>
        );
    }
}


export default connect(
    state => ({auth: state.auth}),
    actions
)(Admin);