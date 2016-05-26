import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../../components/list';
import actions from '../../../../actions';
import { connect } from 'react-redux';

class CategoryList extends Component {

    render() {
        const { categoryStore } = this.props;
        const categories = categoryStore.toArray();

        return <List title="Category List"
                     adderLocation="/admin/categories/adder"
                     fields={this._fields}
                     models={categories}
                     editorLocationBuilder={id => `/admin/categories/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/categories/${id}/deleter`}/>;
    }

    get _fields() {
        return {
            name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            created_date: {
                label: "Created",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated_date: {
                label: "Updated",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

}


export default connect(
    state => ({categoryStore: state.category}),
    actions
)(CategoryList);