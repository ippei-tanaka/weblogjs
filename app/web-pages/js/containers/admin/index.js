import React, { Component } from 'react';
import LoginForm from '../../components/login-form';
import AdminMenu from '../../components/admin-menu';
import Loader from '../../components/loader';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../actions';
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
} from '../../constants/auth-status';


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
        const { requestLogin, authStore, children } = this.props;
        const authStatus = authStore.get('status');
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
        let content = null;

        switch (authStatus) {
            case LOGOUT_CONFIRMED:
            case LOGOUT_SUCCEEDED:
                content = <LoginForm {...loginFormProps} />;
                break;
            case LOGIN_FAILED:
                loginFormProps.error = true;
                content = <LoginForm {...loginFormProps} />;
                break;
            case LOGOUT_FAILED:
            case LOGIN_CONFIRMED:
            case LOGIN_SUCCEEDED:
                content = children;
                break;
            case UNINITIALIZED:
            case WAITING_FOR_LOGIN:
            case WAITING_FOR_STATUS_CHECK:
            default:
                content = <Loader />;
                break;
        }

        return (
            <div className="module-admin">
                {content}
            </div>
        );
    }
}


export default connect(
    state => ({authStore: state.auth}),
    actions
)(Admin);