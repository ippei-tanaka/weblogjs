import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../../components/list';
import actions from '../../../../actions';
import { connect } from 'react-redux';
import { ADMIN_DIR } from '../../../../constants/config'

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
                     adderLocation={`${ADMIN_DIR}/blogs/adder`}
                     fields={this._fields}
                     models={blogs}
                     editorLocationBuilder={id => `${ADMIN_DIR}/blogs/${id}/editor`}
                     deleterLocationBuilder={id => `${ADMIN_DIR}/blogs/${id}/deleter`}/>;
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
    state => ({blogStore: state.blog}),
    actions
)(BlogList);