import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from '../../../../components/user-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';

class UserEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        }
    }

    componentWillMount () {
        const { initializeTransaction, loadUsers } = this.props;
        initializeTransaction();
        loadUsers();
    }

    componentWillReceiveProps (props) {
        if (props.transactionStore.get('status') === RESOLVED) {
            this._goToListPage();
        }
    }

    render() {
        const {
            params : {id},
            userStore,
            transactionStore
            } = this.props;

        let editedUser = userStore.get('users').get(id) || null;
        let errors = transactionStore.get('errors');
        const values = Object.assign({}, editedUser, this.state.values);

        return editedUser ? (
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
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The user doesn't exist.</h2>
            </div>
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
        transactionStore: state.transaction
    }),
    actions
)(UserEditor);
