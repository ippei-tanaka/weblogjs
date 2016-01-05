import React from "react";
import Page from "../../abstructs/page";
import ServerFacade from '../../../services/server-facade';
import LoginForm from '../../partials/login-form';
import { Link, IndexLink } from 'react-router';

const PENDING = 'pending';
const IS_LOGGED_IN = 'is-logged-in';
const IS_NOT_LOGGED_IN = 'is-not-logged-in';
const PRODUCTION_MODE = process.env.NODE_ENV === 'production';

export default class Admin extends Page {

    constructor(props) {
        super(props);

        this.state = {
            authentication: PENDING
        };
    }

    componentDidMount() {
        this.updateAuthState();
    }

    componentWillReceiveProps() {
        this.updateAuthState();
    }

    render() {

        var menu = null;
        var content = null;
        var jsFile = null;
        var cssFiles = null;

        if (this.state.authentication === IS_NOT_LOGGED_IN) {
            content = <LoginForm onLoggedIn={() => this.updateAuthState()}/>;
        }
        else if (this.state.authentication === IS_LOGGED_IN) {
            content = this.props.children;
            menu = (
                <menu>
                    <li>
                        <button onClick={this.onLogOutClicked.bind(this)}>Log out</button>
                    </li>
                    <li><IndexLink to="/admin">Dashboard</IndexLink></li>
                    <li><Link to="/admin/users">Users</Link></li>
                </menu>
            );
        }

        if (PRODUCTION_MODE) {
            jsFile = <script src="/admin/index.js"></script>;
            cssFiles = [
                <link href="/admin/vendors/font-awesome/css/font-awesome.min.css" media="all" rel="stylesheet" />,
                <link href="/admin/style.css" media="all" rel="stylesheet" />
            ];
        } else {
            jsFile = <script src="http://localhost:8080/index.js"></script>;
            cssFiles = <link href="/admin/vendors/font-awesome/css/font-awesome.css" media="all" rel="stylesheet" />;
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

    updateAuthState() {
        ServerFacade.isLoggedIn()
            .then(() => {
                this.setState({authentication: IS_LOGGED_IN});
            })
            .catch(() => {
                this.setState({authentication: IS_NOT_LOGGED_IN});
            });
    }

    onLogOutClicked(event) {
        event.preventDefault();
        this.logout();
    }

    logout() {
        ServerFacade.logout()
            .then(() => {
                this.updateAuthState();
            })
            .catch(() => {
                this.updateAuthState();
            });
    }

};
