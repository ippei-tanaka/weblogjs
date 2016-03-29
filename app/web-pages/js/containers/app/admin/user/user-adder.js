import React, { Component } from 'react';
import { Link } from 'react-router';
import UserForm from '../../../../components/user-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';

class UserAdder extends Component {
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

        let user = userStore.get('users').get(id) || {};
        let errors = transactionStore.get('errors');

        const values = Object.assign({}, user, this.state.values);

        return (
            <UserForm title="Create a New User"
                      errors={errors}
                      values={values}
                      passwordField={true}
                      onChange={this._onChange.bind(this)}
                      onSubmit={this._onSubmit.bind(this)}
                      onClickBackButton={this._goToListPage.bind(this)}
                      submitButtonLabel="Create"
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
        const { createUser } = this.props;
        createUser(this.state.values);
    }

    _goToListPage () {
        this.context.history.pushState(null, "/admin/users");
    }

    static get contextTypes () {
        return {
            history: React.PropTypes.object
        };
    };

}

export default connect(
    state => ({
        userStore: state.user,
        transactionStore: state.transaction
    }),
    actions
)(UserAdder);
