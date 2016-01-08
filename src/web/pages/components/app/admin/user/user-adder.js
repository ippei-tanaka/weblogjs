import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import UserActions from '../../../../actions/user-actions';
import { default as UserStore, CREATE_SUCCESS_EVENT, CREATE_FAIL_EVENT } from '../../../../stores/user-store';
import UserForm from './partials/user-form';
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

        this.createSuccessCallback = this.onCreateSuccess.bind(this);
        this.createFailCallback = this.onCreateFail.bind(this);
    }

    componentDidMount() {
        UserStore.addEventListener(CREATE_SUCCESS_EVENT, this.createSuccessCallback);
        UserStore.addEventListener(CREATE_FAIL_EVENT, this.createFailCallback);
    }

    componentWillUnmount() {
        UserStore.removeEventListener(CREATE_SUCCESS_EVENT, this.createSuccessCallback);
        UserStore.removeEventListener(CREATE_FAIL_EVENT, this.createFailCallback);
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