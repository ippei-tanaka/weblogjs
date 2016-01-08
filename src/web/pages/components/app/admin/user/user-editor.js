import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import UserActions from '../../../../actions/user-actions';
import { default as UserStore, UPDATE_SUCCESS_EVENT, UPDATE_FAIL_EVENT } from '../../../../stores/user-store';
import UserForm from './partials/user-form';
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

        this.updateSuccessCallback = this.onUpdateSuccess.bind(this);
        this.updateFailCallback = this.onUpdateFail.bind(this);
    }

    componentWillMount() {
        UserStore
            .getById(this.props.params.id)
            .then(v => this.setState(s => {s.values = v}));
    }

    componentDidMount() {
        UserStore.addEventListener(UPDATE_SUCCESS_EVENT, this.updateSuccessCallback);
        UserStore.addEventListener(UPDATE_FAIL_EVENT, this.updateFailCallback);
    }

    componentWillUnmount() {
        UserStore.removeEventListener(UPDATE_SUCCESS_EVENT, this.updateSuccessCallback);
        UserStore.removeEventListener(UPDATE_FAIL_EVENT, this.updateFailCallback);
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
        UserActions.update({
            id: this.props.params.id,
            token: this.token,
            data: values
        });
    }

    onUpdateSuccess(action) {
        if (action.token === this.token) {
            this.setState(s => { s.errors = {} });
        }
    }

    onUpdateFail(action, errors) {
        if (action.token === this.token) {
            this.setState(s => { s.errors = errors });
        }
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
