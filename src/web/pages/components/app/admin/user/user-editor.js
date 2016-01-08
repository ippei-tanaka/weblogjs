import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import UserActions from '../../../../actions/user-actions';
import UserStore from '../../../../stores/user-store';
import UserForm from '../../../partials/user-form';


class UserEditor extends Page {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        };

        this.token = this.generateToken();

        this.updateSuccessCallback = this.onUpdateSuccess.bind(this);
        this.updateFailCallback = this.onUpdateFail.bind(this);
    }

    componentWillMount() {
        UserStore
            .getById(this.props.params.id)
            .then(v => this.setState(s => {s.values = v}));
    }

    componentDidMount() {
        UserStore.addUpdateSuccessEventListener(this.updateSuccessCallback);
        UserStore.addUpdateFailEventListener(this.updateFailCallback);
    }

    componentWillUnmount() {
        UserStore.removeUpdateSuccessEventListener(this.updateSuccessCallback);
        UserStore.removeUpdateFailEventListener(this.updateFailCallback);
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
            this.context.history.pushState(null, "/admin/users");
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
