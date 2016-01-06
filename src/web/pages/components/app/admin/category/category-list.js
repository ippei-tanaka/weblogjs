import React from 'react';
import Moment from 'moment';
import List from '../../../partials/list';
import ServerFacade from '../../../../services/server-facade';
//import UserStore from '../../../../stores/user-store';
import Page from '../../../abstructs/page';


class CategoryList extends Page {
    constructor(props) {
        super(props);
        this.state = {models: []};
    }

    componentWillMount() {
        this.updateModels();
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

    //componentDidMount() {
    //    UserStore.addChangeListener(() => this.updateModels());
    //}
    //
    //componentWillUnmount() {
    //    UserStore.removeChangeListener(() => this.updateModels());
    //}

    updateModels() {
        ServerFacade.getCategories()
            .then(value => this.setState({models: value}))
            .catch(data => console.error(data));
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