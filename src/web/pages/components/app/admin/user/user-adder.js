import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import UserActions from '../../../../actions/user-actions';
import UserStore from '../../../../stores/user-store';
import UserForm from '../../../partials/user-form';


class UserAdder extends Page {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        };

        this.token = this.generateToken();

        this.createSuccessCallback = this.onCreateSuccess.bind(this);
        this.createFailCallback = this.onCreateFail.bind(this);
    }

    componentDidMount() {
        UserStore.addCreateSuccessEventListener(this.createSuccessCallback);
        UserStore.addCreateFailEventListener(this.createFailCallback);
    }

    componentWillUnmount() {
        UserStore.removeCreateSuccessEventListener(this.createSuccessCallback);
        UserStore.removeCreateFailEventListener(this.createFailCallback);
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
                      submitButtonLabel="Create"/>
        );
    }

    onSubmit(values) {
        UserActions.create({
            token: this.token,
            data: values
        });
    }

    onCreateSuccess(action) {
        if (action.token === this.token) {
            this.setState(s => { s.errors = {} });
            this.context.history.pushState(null, "/admin/users");
        }
    }

    onCreateFail(action, errors) {
        if (action.token === this.token) {
            this.setState(s => { s.errors = errors });
        }
    }

    get title() {
        return "Create a New User";
    }

}


export default UserAdder;