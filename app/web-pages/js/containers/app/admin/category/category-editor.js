import React, { Component } from 'react';
import { Link } from 'react-router';
import CategoryForm from '../../../../components/category-form';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { RESOLVED } from '../../../../constants/transaction-status';
import { ADMIN_DIR } from '../../../../constants/config'

class CategoryEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {},
            actionId: null
        }
    }

    componentWillMount() {
        this.setState({actionId: Symbol()});
        this.props.loadCategories();
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

    _onChange (field, value) {
        this.setState(state => {
            state.values[field] = value;
        });
    }

    _onSubmit () {
        const { params : {id}, editCategory } = this.props;
        editCategory(this.state.actionId, {id, data: this.state.values});
    }

    _goToListPage() {
        this.context.history.pushState(null, `${ADMIN_DIR}/categories`);
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
)(CategoryEditor);
