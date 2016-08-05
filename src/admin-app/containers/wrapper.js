import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AdminMenu from '../components/admin-menu';
import { connect } from 'react-redux';
import actions from '../actions';
import { LOGOUT_FAILED } from '../constants/auth-status';
import config from '../../config';
import urlResolver from '../../utilities/url-resolver';

const root = config.getValue('adminSiteRoot');
const publicRoot = config.getValue('publicSiteRoot');
const failedToLogout = <div>Failed to log out.</div>;

class AdminWrapper extends Component {

    constructor (props) {
        super(props);

        this.state = {
            mobileMenuVisible: false
        }
    }

    componentDidMount() {
        this.props.loadSetting();
    }

    render() {
        const { mobileMenuVisible } = this.state;
        const { authStore, children, settingStore } = this.props;
        const authStatus = authStore.get('status');
        const content = authStatus !== LOGOUT_FAILED ? children : failedToLogout;
        const theme = settingStore ? settingStore.theme : null;

        return (
            <div className="module-home-page">
                {theme && <link href={urlResolver.resolve(publicRoot, `bundle/themes/${theme}-post.css`)} media="screen" rel="stylesheet"/>}
                <div className="m-hmp-menu-container">
                    <AdminMenu
                        adminRoot={root}
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
    state => ({
        authStore: state.auth,
        settingStore: state.setting
    }),
    actions
)(AdminWrapper);