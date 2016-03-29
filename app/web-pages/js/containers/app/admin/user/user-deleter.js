import React, { Component } from 'react';
import Confirmation from '../../../../components/confirmation';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';

class UserDeleter extends Component {

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
        const { params : {id}, userStore } = this.props;

        const deletedUser = userStore.get('users').get(id) || null;

        return deletedUser ? (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{`Delete the User "${deletedUser.display_name}"`}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this._onApproved.bind(this)}
                    onCanceled={this._goToListPage.bind(this)}
                >{`Do you want to delete "${deletedUser.display_name}"?`}</Confirmation>
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The user doesn't exist.</h2>
            </div>
        );
    }

    _onApproved () {
        const { params : {id}, deleteUser } = this.props;
        deleteUser({id});
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
)(UserDeleter);