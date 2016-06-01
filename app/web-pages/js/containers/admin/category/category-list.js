import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../components/list';
import actions from '../../../actions';
import { connect } from 'react-redux';
import { ADMIN_DIR } from '../../../constants/config'

class CategoryList extends Component {

    componentDidMount() {
        this.props.loadCategories();
    }

    render() {
        const { categoryStore } = this.props;
        const categories = categoryStore.toArray();

        return <List title="Category List"
                     adderLocation={`${ADMIN_DIR}/categories/adder`}
                     fields={this._fields}
                     models={categories}
                     editorLocationBuilder={id => `${ADMIN_DIR}/categories/${id}/editor`}
                     deleterLocationBuilder={id => `${ADMIN_DIR}/categories/${id}/deleter`}/>;
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
                label: "Created Date",
                stringify: value =>
                    value ? Moment(value).format("YYYY-MM-DD HH:mm Z") : this.noneElement
            },

            updated_date: {
                label: "Updated Date",
                stringify: value =>
                    value ? Moment(value).format("YYYY-MM-DD HH:mm Z") : this.noneElement
            }
        }
    }

    get noneElement () {
        return <span className="m-dtl-none">(None)</span>;
    }
}


export default connect(
    state => ({categoryStore: state.category}),
    actions
)(CategoryList);