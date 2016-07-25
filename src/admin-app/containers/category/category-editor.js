import React, { Component } from 'react';
import CategoryForm from '../../../react-components/category-form';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import config from '../../../config';

const root = config.getValue('adminSiteRoot');

class CategoryEditor extends Component {

    constructor (props)
    {
        super(props);

        this.state = {
            values: {},
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
        const {params: {id}, categoryStore, transactionStore} = this.props;
        const editedCategory = categoryStore.get(id) || null;
        const transaction = transactionStore.get(this.state.actionId);
        const errors = transaction ? transaction.get('errors') : {};
        const values = Object.assign({}, editedCategory, this.state.values);

        return editedCategory ? (
            <div>
                <CategoryForm title={`Edit the Category "${editedCategory.display_name}"`}
                              errors={errors}
                              values={values}
                              onChange={this._onChange.bind(this)}
                              onSubmit={this._onSubmit.bind(this)}
                              onClickBackButton={this._goToListPage.bind(this)}
                              submitButtonLabel="Update"
                />
            </div>
        ) : (
            <div className="module-data-editor">
                <h2 className="m-dte-title">The category doesn't exist.</h2>
            </div>
        );
    }

    _onChange (field, value)
    {
        this.setState(state =>
        {
            state.values[field] = value;
        });
    }

    _onSubmit ()
    {
        const { params : {id}, editCategory } = this.props;
        editCategory({
            actionId: this.state.actionId,
            id,
            data: this.state.values
        });
    }

    _goToListPage ()
    {
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
        transactionStore: state.transaction
    }),
    actions
)(CategoryEditor);
