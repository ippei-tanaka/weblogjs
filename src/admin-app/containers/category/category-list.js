import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../react-components/list';
import actions from '../../actions';
import { connect } from 'react-redux';
import config from '../../../config';

const root = config.getValue('adminSiteRoot');

class CategoryList extends Component {

    componentDidMount ()
    {
        this.props.loadCategories();
    }

    render ()
    {
        const { categoryStore } = this.props;
        const categories = categoryStore.toArray();

        return <List title="Category List"
                     adderLocation={`${root}/categories/adder`}
                     fields={this._fields}
                     models={categories}
                     editorLocationBuilder={id => `${root}/categories/${id}/editor`}
                     deleterLocationBuilder={id => `${root}/categories/${id}/deleter`}/>;
    }

    get _fields ()
    {
        return {
            name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            created_date: {
                label: "Created Date",
                stringify: value =>
                    value ? Moment(value).format("YYYY-MM-DD HH:mm") : this.noneElement
            },

            updated_date: {
                label: "Updated Date",
                stringify: value =>
                    value ? Moment(value).format("YYYY-MM-DD HH:mm") : this.noneElement
            }
        }
    }

    get noneElement ()
    {
        return <span className="m-dtl-none">(None)</span>;
    }
}

export default connect(
    state => ({
        categoryStore: state.category
    }),
    actions
)(CategoryList);