import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import CategoryStore from '../../../../stores/category-store';
import CategoryForm from './partials/category-form';
import hat from 'hat';


var rack = hat.rack();


class CategoryEditor extends Page {

    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            values: {}
        };

        this.token = rack();

        this.callback = this.onStoreChanged.bind(this);
    }

    componentDidMount() {
        this.updateValues();
        CategoryStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        CategoryStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return (
            <CategoryForm title={this.title}
                          errors={this.state.errors}
                          values={this.state.values}
                          autoSlugfy={false}
                          onSubmit={this.onSubmit.bind(this)}
                          submitButtonLabel="Update"
                          locationForBackButton="/admin/categories"
            />
        );
    }

    onSubmit(values) {
        ViewActionCreator.requestUpdateCategory({
            id: this.props.params.id,
            token: this.token,
            data: values
        });
    }

    onStoreChanged() {
        var action = CategoryStore.latestAction;

        this.updateValues();

        if (action && action.token === this.token) {
            if (action.data && action.data.errors) {
                this.setState(s => {
                    s.errors = action.data.errors
                });
            } else {
                this.context.history.pushState(null, "/admin/categories");
            }
        }
    }

    updateValues() {
        this.setState(s => {
            s.values = CategoryStore.get(this.props.params.id) || {};
        });
    }

    get title() {
        return `Edit the User "${this.state.values.display_name}"`;
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        };
    }

}


export default CategoryEditor;
