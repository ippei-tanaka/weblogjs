import React, { Component } from 'react';
import Confirmation from '../../../react-components/confirmation';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import config from '../../../config';

const root = config.getValue('adminSiteRoot');

class UserDeleter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionId: null
        }
    }

    componentDidMount() {
        this.setState({actionId: Symbol()});
        this.props.loadUsers();
    }

    componentWillUnmount() {
        this.props.finishTransaction({actionId: this.state.actionId});
    }

    componentWillReceiveProps(props) {
        const transaction = props.transactionStore.get(this.state.actionId);

        if (transaction && transaction.get('status') === RESOLVED) {
            this._goToListPage();
        }
    }

    render() {
        const { params : {id}, userStore } = this.props;

        const deletedUser = userStore.get(id) || null;

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

    _onApproved() {
        const { params : {id}, deleteUser } = this.props;
        deleteUser({actionId: this.state.actionId, id});
    }

    _goToListPage() {
        this.context.router.push(`${root}/users`);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object.isRequired
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