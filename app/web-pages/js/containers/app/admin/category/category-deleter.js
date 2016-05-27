import React, { Component } from 'react';
import Confirmation from '../../../../components/confirmation';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';

class CategoryDeleter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionId: null
        }
    }

    componentWillMount() {
        this.setState({actionId: Symbol()});
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.actionId);
    }

    componentWillReceiveProps(props) {
        const transaction = props.transactionStore.get(this.state.actionId);

        if (transaction && transaction.get('status') === RESOLVED) {
            this._goToListPage();
        }
    }

    render() {
        const { params : {id}, categoryStore } = this.props;

        const deletedCategory = categoryStore.get(id) || null;

        return deletedCategory ? (
            <div className="module-data-editor">
                <h2 className="m-dte-title">{`Delete the Category "${deletedCategory.name}"`}</h2>
                <Confirmation
                    mode="choose"
                    onApproved={this._onApproved.bind(this)}
                    onCanceled={this._goToListPage.bind(this)}
                >{`Do you want to delete "${deletedCategory.name}"?`}</Confirmation>
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The category doesn't exist.</h2>
            </div>
        );
    }

    _onApproved () {
        const { params : {id}, deleteCategory } = this.props;
        deleteCategory(this.state.actionId, {id});
    }

    _goToListPage () {
        this.context.history.pushState(null, "/admin/categories");
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
        categoryStore: state.category,
        transactionStore: state.transaction
    }),
    actions
)(CategoryDeleter);