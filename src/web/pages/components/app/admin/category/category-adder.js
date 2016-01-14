import React from 'react';
import { Link } from 'react-router';
import Page from '../../../abstructs/page';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import CategoryStore from '../../../../stores/category-store';
import CategoryForm from '../../../partials/category-form';
import hat from 'hat';


var rack = hat.rack();


class CategoryAdder extends Page {

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
                          autoSlugfy={true}
                          passwordField={true}
                          onSubmit={this.onSubmit.bind(this)}
                          submitButtonLabel="Create"
                          locationForBackButton="/admin/categories"
            />
        );
    }

    onSubmit(values) {
        ViewActionCreator.requestCreateCategory({
            token: this.token,
            data: values
        });
    }

    onStoreChanged() {
        var action = CategoryStore.latestAction;

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

    get title() {
        return "Create a New Category";
    }

}


export default CategoryAdder;