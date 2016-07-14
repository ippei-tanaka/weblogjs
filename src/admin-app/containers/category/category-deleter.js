import React, { Component } from 'react';
import Confirmation from '../../../react-components/confirmation';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';

class CategoryDeleter extends Component {

    constructor (props)
    {
        super(props);

        this.state = {
            actionId: null
        }
    }

    componentDidMount ()
    {
        this.setState({actionId: Symbol()});
        this.props.loadCategories();
    }

    componentWillUnmount ()
    {
        this.props.finishTransaction({actionId: this.state.actionId});
    }

    componentWillReceiveProps (props)
    {
        const transaction = props.transactionStore.get(this.state.actionId);

        if (transaction && transaction.get('status') === RESOLVED)
        {
            this._goToListPage();
        }
    }

    render ()
    {
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

    _onApproved ()
    {
        const { params : {id}, deleteCategory } = this.props;

        deleteCategory({
            actionId: this.state.actionId,
            id
        });
    }

    _goToListPage ()
    {
        const root = this.props.adminSiteInfoStore.get("webpageRootForAdmin");
        this.context.router.push(`${root}/categories`);
    }

    static get contextTypes ()
    {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    static get propTypes ()
    {
        return {
            params: React.PropTypes.object.isRequired
        };
    }

}

export default connect(
    state => ({
        categoryStore: state.category,
        transactionStore: state.transaction,
        adminSiteInfoStore: state.adminSiteInfo
    }),
    actions
)(CategoryDeleter);