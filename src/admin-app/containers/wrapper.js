import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginForm from '../../react-components/login-form';
import AdminMenu from '../../react-components/admin-menu';
import Loader from '../../react-components/loader';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import actions from '../actions';
import { LOGOUT_FAILED } from '../constants/auth-status';
import { ADMIN_DIR } from '../constants/config';

const FailedToLogout = <div>Failed to log out.</div>;

class AdminWrapper extends Component {

    constructor (props) {
        super(props);

        this.state = {
            mobileMenuVisible: false
        }
    }

    render() {
        const { mobileMenuVisible } = this.state;
        const { authStore, children } = this.props;
        const authStatus = authStore.get('status');
        const content = authStatus !== LOGOUT_FAILED ? children : FailedToLogout;

        return (
            <div className="module-home-page">
                <div className="m-hmp-menu-container">
                    <AdminMenu
                        adminRoot={ADMIN_DIR}
                        onLinkClick={this._onMenuButtonClick.bind(this)}
                        onLogoutClick={this._onLogoutClick.bind(this)}
                        onToggleClick={this._onMenuToggle.bind(this)}
                        onFirstElementFocus={this._onBlueOutMenuToTop.bind(this)}
                        onLastElementFocus={this._onBlueOutMenuToBottom.bind(this)}
                        mobileMenuVisible={mobileMenuVisible}
                    />
                </div>
                <div className="m-hmp-content-container1">
                    <div className="m-hmp-content-container2">
                        {content}
                    </div>
                </div>
            </div>
        );
    }

    _onMenuButtonClick () {
        this.setState({mobileMenuVisible: false});
    }

    _onMenuToggle () {
        this.setState({mobileMenuVisible: !this.state.mobileMenuVisible});
    }

    _onLogoutClick () {
        const message = "Are you sure that you want to log out?";

        if (window.confirm(message)) {
            this.props.requestLogout();
        }
    }

    _onBlueOutMenuToTop () {
        const el = ReactDOM.findDOMNode(this);
        el.querySelector('[data-weblog="m-nvg-log-out-button"]').focus();
    }

    _onBlueOutMenuToBottom () {
        const el = ReactDOM.findDOMNode(this);
        el.querySelector('[data-weblog="m-nvg-toggle-button"]').focus();
    }
}


export default connect(
    state => ({authStore: state.auth}),
    actions
)(AdminWrapper);