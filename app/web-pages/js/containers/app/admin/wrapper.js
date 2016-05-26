import React, { Component } from 'react';
import LoginForm from '../../../components/login-form';
import AdminMenu from '../../../components/admin-menu';
import Loader from '../../../components/loader';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import actions from '../../../actions';
import { LOGOUT_FAILED } from '../../../constants/auth-status';


class AdminWrapper extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionIdForUsers: null,
            actionIdForCategories: null
        }
    }

    componentWillMount() {
        this.setState({
            actionIdForUsers: Symbol(),
            actionIdForCategories: Symbol()
        });
    }

    componentDidMount() {
        this.props.loadUsers(this.state.actionIdForUsers);
        this.props.loadCategories(this.state.actionIdForCategories);
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.actionIdForUsers);
        this.props.finishTransaction(this.state.actionIdForCategories);
    }

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