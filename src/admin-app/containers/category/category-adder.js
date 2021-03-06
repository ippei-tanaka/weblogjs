import React, { Component } from 'react';
import CategoryForm from '../../components/category-form';
import actions from '../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../constants/transaction-status';
import config from '../../../config';

const root = config.getValue('adminSiteRoot');

class CategoryAdder extends Component {
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
        const {transactionStore} = this.props;
        const {values, actionId} = this.state;
        const transaction = transactionStore.get(actionId);
        const errors = transaction ? transaction.get('errors') : {};

        return (
            <CategoryForm title="Create a New Category"
                          errors={errors}
                          values={values}
                          onChange={this._onChange.bind(this)}
                          onSubmit={this._onSubmit.bind(this)}
                          onClickBackButton={this._goToListPage.bind(this)}
                          submitButtonLabel="Create"
            />
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
        this.props.createCategory({
            actionId: this.state.actionId,
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

}

export default connect(
    state => ({
        transactionStore: state.transaction
    }),
    actions
)(CategoryAdder);