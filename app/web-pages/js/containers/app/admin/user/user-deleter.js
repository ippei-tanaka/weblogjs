import React, { Component } from 'react';
import Confirmation from '../../../../components/partials/confirmation';
import actions from '../../../../actions';
import { connect } from 'react-redux';


class UserDeleter extends Component {

    componentDidMount () {
        const { loadUsers } = this.props;
        loadUsers();
    }

    render() {
        const { params : {id}, userStore } = this.props;

        const deletedUser = userStore.get('users').get(id) || null;

        return deletedUser ? (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{`Delete the User "${deletedUser.display_name}"`}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this._onApproved.bind(this)}
                    onCanceled={this._goToListPage.bind(this)}
                >{`Do you want to delete "${deletedUser.display_name}"?`}</Confirmation>
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The user doesn't exist.</h2>
            </div>
        );
    }

    _onApproved () {
        const { params : {id}, deleteUser } = this.props;

        deleteUser({id});
    }

    _goToListPage () {
        this.context.history.pushState(null, "/admin/users");
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}

export default connect(
    state => ({
        userStore: state.user,
        errorStore: state.error
    }),
    actions
)(UserDeleter);

/*
import React from 'react';
import UserStore from '../../../../stores/user-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';
import Confirmation from '../../../partials/confirmation';
import hat from 'hat';

var rack = hat.rack();

class UserDeleter extends Page {

    constructor(props) {
        super(props);

        this.state = {
            values: ""
        };

        this.token = rack();

        this.callback = this.onStoreChanged.bind(this);
    }

    componentDidMount() {
        this.updateValues();
        UserStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{this.title}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this.onApproved.bind(this)}
                    onCanceled={this.onCanceled.bind(this)}
                >{this.label}</Confirmation>
            </div>
        );
    }

    onApproved () {
        ViewActionCreator.requestDeleteUser({
            token: this.token,
            id: this.props.params.id
        });
    }

    onCanceled () {
        this.goToListPage();
    }

    onStoreChanged() {
        var action = UserStore.latestAction;

        this.updateValues();

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => { s.errors = action.data.errors });
            } else {
                this.goToListPage();
            }
        }
    }

    goToListPage () {
        this.context.history.pushState(null, "/admin/users");
    }

    updateValues () {
        this.setState(s => {
            s.values = UserStore.get(this.props.params.id) || {};
        });
    }

    get title() {
        return `Delete the User "${this.state.values.display_name}"`;
    }

    get label() {
        return `Do you want to delete "${this.state.values.display_name}"?`;
    }
}


export default UserDeleter;
*/