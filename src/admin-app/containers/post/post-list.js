import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../react-components/list';
import actions from '../../actions';
import { connect } from 'react-redux';

class PostList extends Component {

    componentDidMount ()
    {
        this.props.loadPosts();
        this.props.loadBlogs();
        this.props.loadCategories();
        this.props.loadUsers();
    }

    render ()
    {
        const { postStore, categoryStore, blogStore, userStore, adminSiteInfoStore } = this.props;
        const posts = postStore.toArray();
        const categoryList = categoryStore.toArray();
        const blogList = blogStore.toArray();
        const authorList = userStore.toArray();
        const root = adminSiteInfoStore.toJS().webpageRootForAdmin;

        return <List title="Post List"
                     adderLocation={`${root}/posts/adder`}
                     fields={this._getFields({authorList, blogList, categoryList})}
                     models={posts}
                     editorLocationBuilder={id => `${root}/posts/${id}/editor`}
                     deleterLocationBuilder={id => `${root}/posts/${id}/deleter`}/>;
    }

    _getFields ({authorList, blogList, categoryList})
    {
        return {
            title: {
                label: "Title"
            },

            content: {
                label: "Content"
            },

            slug: {
                label: "Slug"
            },

            author_id: {
                label: "Author",
                stringify: value =>
                {
                    if (!value)
                    {
                        return this.noneElement;
                    }
                    else
                    {
                        let author = authorList.find(a => value === a._id);
                        return author ? author.display_name : this.deletedElement;
                    }
                }
            },

            category_id: {
                label: "Category",
                stringify: value =>
                {
                    if (!value)
                    {
                        return this.noneElement;
                    }
                    else
                    {
                        let category = categoryList.find(a => value === a._id);
                        return category ? category.name : this.deletedElement;
                    }
                }
            },

            blog_id: {
                label: "Blog",
                stringify: value =>
                {
                    if (!value)
                    {
                        return this.noneElement;
                    }
                    else
                    {
                        let blog = blogList.find(a => value === a._id);
                        return blog ? blog.name : this.deletedElement;
                    }
                }
            },

            tags: {
                label: "Tags",
                stringify: value =>
                {
                    return Array.isArray(value) && value.length > 0
                        ? value.join(', ')
                        : this.noneElement;
                }
            },

            published_date: {
                label: "Published Date",
                stringify: value =>
                    value ? Moment(value).format("YYYY-MM-DD HH:mm") : this.noneElement
            },

            is_draft: {
                label: "Is Draft",
                stringify: value => (value === true) ? "Yes" : "No"
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

    get deletedElement ()
    {
        return <span className="m-dtl-none">(Deleted)</span>;
    }
}

export default connect(
    state => ({
        postStore: state.post,
        blogStore: state.blog,
        userStore: state.user,
        categoryStore: state.category,
        transactionStore: state.transaction,
        adminSiteInfoStore: state.adminSiteInfo
    }),
    actions
)(PostList);