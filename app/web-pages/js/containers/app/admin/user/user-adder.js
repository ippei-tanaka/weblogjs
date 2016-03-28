import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from '../../../../components/user-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';

class UserAdder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        }
    }

    componentDidMount () {
        const { clearErrors, loadUsers } = this.props;
        clearErrors();
        loadUsers();
    }

    render() {
        const {
            params : {id},
            userStore,
            errorStore,
            createUser
            } = this.props;

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
