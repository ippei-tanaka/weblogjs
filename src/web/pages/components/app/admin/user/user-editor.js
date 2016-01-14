import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import UserStore from '../../../../stores/user-store';
import UserForm from '../../../partials/user-form';
import hat from 'hat';


var rack = hat.rack();


class UserEditor extends Page {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        };

        this.token = rack();

        this.callback = this.onStoreChanged.bind(this);
    }

    componentDidMount() {
        this.updateValues();
        ViewActionCreator.requestLoadingUsers();
        UserStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <UserForm title={this.title}
                      errors={this.state.errors}
                      values={this.state.values}
                      autoSlugfy={false}
                      passwordField={false}
                      onSubmit={this.onSubmit.bind(this)}
                      submitButtonLabel="Update"/>
        );
    }

    onSubmit(values) {
        ViewActionCreator.requestUpdateUser({
            id: this.props.params.id,
            token: this.token,
            data: values
        });
    }

    onStoreChanged() {
        var action = UserStore.latestAction;

        this.updateValues();

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => { s.errors = action.data.errors });
            } else {
                this.context.history.pushState(null, "/admin/users");
            }
        }
    }

    updateValues () {
        this.setState(s => {
            s.values = UserStore.get(this.props.params.id) || {};
        });
    }

    get title() {
        return `Edit the User "${this.state.values.display_name}"`;
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}


export default UserEditor;
