import React from "react";
import Page from "../../abstructs/page";
import LoginForm from './partials/login-form';
import AdminMenu from './partials/admin-menu';
import { Link, IndexLink } from 'react-router';
import AuthStore from '../../../stores/auth-store';
import ViewActionCreator from '../../../action-creators/view-action-creator';
import hat from 'hat';


const PENDING = 'pending';
const IS_LOGGED_IN = 'is-logged-in';
const IS_NOT_LOGGED_IN = 'is-not-logged-in';
const PRODUCTION_MODE = process.env.NODE_ENV === 'production';

var rack = hat.rack();


export default class Admin extends Page {

    constructor(props) {
        super(props);

        this.state = {
            authentication: PENDING,
            loginFailed: false
        };

        this.token = rack();

        this.callback = this.onStoreChanged.bind(this);
    }

    componentDidMount() {
        this.updateAuthState();
        AuthStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        AuthStore.removeChangeListener(this.callback);
    }

    render() {

        var menu = null;
        var content = null;
        var jsFile = null;
        var cssFiles = null;

        if (this.state.authentication === IS_NOT_LOGGED_IN) {
            content = <LoginForm
                error={this.state.loginFailed}
                onSubmit={this.onLoginFormSubmitted.bind(this)}
            />;
        }
        else if (this.state.authentication === IS_LOGGED_IN) {
            content = this.props.children;
            menu = (
                <AdminMenu onLogoutClick={this.onLogOutClicked.bind(this)}/>
            );
        }

        if (PRODUCTION_MODE) {
            jsFile = <script src="/admin/index.js"></script>;
            cssFiles = [
                <link href="/admin/vendors/font-awesome/css/font-awesome.min.css" media="all" rel="stylesheet"/>,
                <link href="/admin/style.css" media="all" rel="stylesheet"/>
            ];
        } else {
            jsFile = <script src="http://localhost:8080/index.js"></script>;
            cssFiles = <link href="/admin/vendors/font-awesome/css/font-awesome.css" media="all" rel="stylesheet"/>;
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

    onStoreChanged() {
        this.updateAuthState();
    }

    updateAuthState() {
        if (AuthStore.isLoggedIn) {
            this.setState({authentication: IS_LOGGED_IN});
        } else {
            this.setState({authentication: IS_NOT_LOGGED_IN});
        }
    }

    onLoginFormSubmitted ({email, password}) {
        ViewActionCreator.requestLogin({
            email,
            password,
            token: this.token
        });
    }

    onLogOutClicked(event) {
        event.preventDefault();
        ViewActionCreator.requestLogout({
            token: this.token
        });
    }

};
