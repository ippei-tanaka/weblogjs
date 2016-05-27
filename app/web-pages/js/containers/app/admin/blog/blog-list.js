import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../../components/list';
import actions from '../../../../actions';
import { connect } from 'react-redux';

class BlogList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            actionId: null
        }
    }

    componentWillMount() {
        this.setState({actionId: Symbol()});
        this.props.loadBlogs(this.state.actionId);
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.actionId);
    }

    render() {
        const { blogStore } = this.props;
        const blogs = blogStore.toArray();

        return <List title="Blog List"
                     adderLocation="/admin/blogs/adder"
                     fields={this._fields}
                     models={blogs}
                     editorLocationBuilder={id => `/admin/blogs/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/blogs/${id}/deleter`}/>;
    }

    get _fields() {
        return {
            name: {
                label: "Name"
            },

            slug: {
                label: "Slug"
            },

            posts_per_page: {
                label: "Posts Per Page"
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
    state => ({blogStore: state.blog}),
    actions
)(BlogList);