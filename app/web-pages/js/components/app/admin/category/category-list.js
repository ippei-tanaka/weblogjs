import React from 'react';
import Moment from 'moment';
import List from '../../../partials/list';
import CategoryStore from '../../../../stores/category-store';
import ViewActionCreator from '../../../../action-creators/view-action-creator';
import Page from '../../../abstructs/page';


class CategoryList extends Page {

    constructor(props) {
        super(props);

        this.state = {
            models: []
        };

        this.callback = this.updateModels.bind(this);
    }

    componentDidMount() {
        this.updateModels();
        CategoryStore.addChangeListener(this.callback);
    }

    componentWillUnmount() {
        CategoryStore.removeChangeListener(this.callback);
    }

    render() {
        this.setPageTitle(this.title);

        return <List title={this.title}
                     adderLocation="/admin/categories/adder"
                     fields={this.fields}
                     models={this.state.models}
                     editorLocationBuilder={id => `/admin/categories/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/categories/${id}/deleter`}/>;
    }

    updateModels() {
        this.setState({models: CategoryStore.getAll()});
    }

    get fields() {
        return {
            name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            created: {
                label: "Created",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated: {
                label: "Updated",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

    get title() {
        return "Category List";
    }

}

export default CategoryList;