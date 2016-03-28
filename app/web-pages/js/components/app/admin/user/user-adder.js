import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from './partials/user-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import {
    UNINITIALIZED,
    LOADING_USERS,
    USERS_LOAD_SUCCEEDED,
    USERS_LOAD_FAILED
} from '../../../../constants/user-status';


class UserAdder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        }
    }

    componentDidMount () {
        const { clearErrors } = this.props;
        clearErrors();
    }

    render() {
        const {
            params : {id},
            userStore,
            errorStore,
            createUser,
            loadUsers
            } = this.props;

        const status = userStore.get('status');

        if (status === UNINITIALIZED) {
            loadUsers();
        }

        let user = userStore.get('users').get(id) || {};

        let errors = errorStore.get('user');

        const values = Object.assign({}, user, this.state.values);

        return (
            <UserForm title="Create a new user"
                      errors={errors}
                      values={values}
                      autoSlugfy={false}
                      passwordField={true}
                      onChange={(field, value) => this.setState(state => {state.values[field] = value})}
                      onSubmit={() => createUser(this.state.values)}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/users"
            />
        );
    }

}

export default connect(
    state => ({
        userStore: state.user,
        errorStore: state.error
    }),
    actions
)(UserAdder);
/*
import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import UserStore from '../../../../stores/user-store';
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
*/