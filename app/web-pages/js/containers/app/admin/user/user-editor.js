import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from '../../../../components/user-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';


class UserEditor extends Component {
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
            editUser,
            userStore,
            errorStore
            } = this.props;

        let editedUser = userStore.get('users').get(id) || {};

        let errors = errorStore.get('user');

        const values = Object.assign({}, editedUser, this.state.values);

        return (
            <UserForm title={`Edit the User "${editedUser.display_name}"`}
                      errors={errors}
                      values={values}
                      autoSlugfy={false}
                      passwordField={false}
                      onChange={(field, value) => this.setState(state => {state.values[field] = value})}
                      onSubmit={() => editUser({id, data: this.state.values})}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/users"
            />
        );
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
)(UserEditor);
