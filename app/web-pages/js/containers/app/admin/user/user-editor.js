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
                      passwordField={false}
                      onChange={this._onChange.bind(this)}
                      onSubmit={this._onSubmit.bind(this)}
                      onClickBackButton={this._goToListPage.bind(this)}
                      submitButtonLabel="Update"
                      locationForBackButton="/admin/users"
            />
        );
    }

    _onChange (field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit () {
        const { params : {id}, editUser } = this.props;
        editUser({id, data: this.state.values});
    }

    _goToListPage () {
        this.context.history.pushState(null, "/admin/users");
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object
        };
    };

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
