import React from "react";
import ServerFacade from '../../../services/server-facade';
import LoginForm from './login-form';
import { Link, IndexLink } from 'react-router';

const PENDING = 'pending';
const IS_LOGGED_IN = 'is-logged-in';
const IS_NOT_LOGGED_IN = 'is-not-logged-in';

export default class Admin extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            authentication: PENDING
        };
    }

    componentDidMount () {
        this.updateAuthState();
    }

    componentWillReceiveProps () {
        this.updateAuthState();
    }

    render () {

        var menu = null;
        var content = null;

        if (this.state.authentication === IS_NOT_LOGGED_IN) {
            content = <LoginForm onLoggedIn={() => this.updateAuthState()} />;
        } else if (this.state.authentication === IS_LOGGED_IN) {
            content = this.props.children;
            menu = (
                <menu>
                    <li><button onClick={this.onLogOutClicked.bind(this)}>Log out</button></li>
                    <li><IndexLink to="/admin">Dashboard</IndexLink></li>
                    <li><Link to="/admin/users">Users</Link></li>
                </menu>
            );
        }

        return (
            <div>
                {menu}
                {content}
            </div>
        );
    }

    updateAuthState () {
        ServerFacade.isLoggedIn()
            .then(() => {
                this.setState({ authentication: IS_LOGGED_IN });
            })
            .catch(() => {
                this.setState({ authentication: IS_NOT_LOGGED_IN });
            });
    }

    onLogOutClicked (event) {
        event.preventDefault();
        this.logout();
    }

    logout () {
        ServerFacade.logout()
            .then(() => {
                this.updateAuthState();
            })
            .catch(() => {
                this.updateAuthState();
            });
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object,
            location: React.PropTypes.object
        };
    };

};
