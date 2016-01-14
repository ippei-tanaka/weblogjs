import React from 'react';
import UserStore from '../../../../stores/user-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';
import Deleter from '../../../partials/deleter';
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
            <Deleter title={this.title}
                     label={this.label}
                     onApproved={this.onApproved.bind(this)}
                     onCanceled={this.goToListPage.bind(this)}/>
        );
    }

    onApproved () {
        ViewActionCreator.requestDeleteUser({
            token: this.token,
            id: this.props.params.id
        });
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