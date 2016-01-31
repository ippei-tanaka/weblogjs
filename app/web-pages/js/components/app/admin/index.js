import React, { Component } from 'react';
import LoginForm from './partials/login-form';
import AdminMenu from './partials/admin-menu';
import Loader from '../../partials/loader';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import * as authActions from '../../../action-creators/auth';
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


const PRODUCTION_MODE = process.env.NODE_ENV === 'production';


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
        let content = null;
        let menu = null;
        let jsFile = null;
        let cssFiles = [
            <link key="1" href="/admin/vendors/font-awesome/css/font-awesome.min.css" media="all" rel="stylesheet"/>,
            <link key="2" href="/admin/style.css" media="all" rel="stylesheet"/>
        ];

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

        if (PRODUCTION_MODE) {
            jsFile = <script src="/admin/index.js"></script>;
        } else {
            jsFile = <script src="//localhost:8080/index.js"></script>;
        }

        return (
            <div className="module-admin">
                {menu}
                {content}
                {cssFiles}
                {jsFile}
            </div>
        );
    }
}


export default connect(
    state => ({auth: state.auth}),
    authActions
)(Admin);