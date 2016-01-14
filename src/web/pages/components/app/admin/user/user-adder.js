import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import UserStore from '../../../../stores/user-store';
import UserForm from '../../../partials/user-form';
import hat from 'hat';


var rack = hat.rack();


class UserAdder extends Page {

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
                      autoSlugfy={true}
                      passwordField={true}
                      onSubmit={this.onSubmit.bind(this)}
                      submitButtonLabel="Create"
                      locationForBackButton="/admin/users"
            />
        );
    }

    onSubmit(values) {
        ViewActionCreator.requestCreateUser({
            token: this.token,
            data: values
        });
    }

    onStoreChanged() {
        var action = UserStore.latestAction;

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => {
                    s.errors = action.data.errors
                });
            } else {
                this.context.history.pushState(null, "/admin/users");
            }
        }
    }

    get title() {
        return "Create a New User";
    }

}


export default UserAdder;