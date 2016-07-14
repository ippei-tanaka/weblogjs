import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../react-components/list';
import actions from '../../actions';
import { connect } from 'react-redux';

class BlogList extends Component {

    componentDidMount() {
        this.props.loadBlogs();
    }

    render() {
        const { blogStore, adminSiteInfoStore } = this.props;
        const blogs = blogStore.toArray();
        const root = adminSiteInfoStore.get("webpageRootForAdmin");

        return <List title="Blog List"
                     adderLocation={`${root}/blogs/adder`}
                     fields={this._fields}
                     models={blogs}
                     editorLocationBuilder={id => `${root}/blogs/${id}/editor`}
                     deleterLocationBuilder={id => `${root}/blogs/${id}/deleter`}/>;
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

            script_snippet: {
                label: "Script Snippet"
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

    get noneElement () {
        return <span className="m-dtl-none">(None)</span>;
    }

}


export default connect(
    state => ({
        blogStore: state.blog,
        adminSiteInfoStore: state.adminSiteInfo
    }),
    actions
)(BlogList);