import React, { Component } from 'react';
import Moment from 'moment';
import List from '../../../../components/list';
import actions from '../../../../actions';
import { connect } from 'react-redux';

class PostList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            postLoadActionId: null,
            blogLoadActionId: null,
            categoryLoadActionId: null,
            userLoadActionId: null
        }
    }

    componentWillMount() {
        this.setState({
            postLoadActionId: Symbol(),
            blogLoadActionId: Symbol(),
            categoryLoadActionId: Symbol(),
            userLoadActionId: Symbol()
        });
        this.props.loadPosts(this.state.postLoadActionId);
        this.props.loadBlogs(this.state.blogLoadActionId);
        this.props.loadCategories(this.state.categoryLoadActionId);
        this.props.loadUsers(this.state.userLoadActionId);
    }

    componentWillUnmount() {
        this.props.finishTransaction(this.state.postLoadActionId);
        this.props.finishTransaction(this.state.blogLoadActionId);
        this.props.finishTransaction(this.state.categoryLoadActionId);
        this.props.finishTransaction(this.state.userLoadActionId);
    }

    render() {
        const { postStore, categoryStore, blogStore, userStore } = this.props;
        const posts = postStore.toArray();
        const categoryList = categoryStore.toArray();
        const blogList = blogStore.toArray();
        const authorList = userStore.toArray();

        return <List title="Post List"
                     adderLocation="/admin/posts/adder"
                     fields={this._getFields({authorList, blogList, categoryList})}
                     models={posts}
                     editorLocationBuilder={id => `/admin/posts/${id}/editor`}
                     deleterLocationBuilder={id => `/admin/posts/${id}/deleter`}/>;
    }

    _getFields({authorList, blogList, categoryList}) {
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
                stringify: value => {
                    if (!value) {
                        return this.noneElement;
                    } else {
                        let author = authorList.find(a => value === a._id);
                        return author ? author.display_name : this.deletedElement;
                    }
                }
            },

            category_id: {
                label: "Category",
                stringify: value => {
                    if (!value) {
                        return this.noneElement;
                    } else {
                        let category = categoryList.find(a => value === a._id);
                        return category ? category.name : this.deletedElement;
                    }
                }
            },

            blog_id: {
                label: "Blog",
                stringify: value => {
                    if (!value) {
                        return this.noneElement;
                    } else {
                        let blog = blogList.find(a => value === a._id);
                        return blog ? blog.name : this.deletedElement;
                    }
                }
            },

            tags: {
                label: "Tags",
                stringify: value => {
                    return value.length > 0 ? value.join(', ') : this.noneElement;
                }
            },

            publish_date: {
                label: "Publish Date",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            is_draft: {
                label: "Is Draft",
                stringify: value => (value === true) ? "Yes" : "No"

            },

            created: {
                label: "Created Date",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            },

            updated: {
                label: "Updated Date",
                stringify: value =>
                    Moment(value).format("YYYY-MM-DD HH:mm Z")
            }
        }
    }

    get noneElement () {
        return <span className="m-dtl-none">(None)</span>;
    }

    get deletedElement () {
        return <span className="m-dtl-none">(Deleted)</span>;
    }
}

export default connect(
    state => ({
        postStore: state.post,
        blogStore: state.blog,
        userStore: state.user,
        categoryStore: state.category,
        transactionStore: state.transaction
    }),
    actions
)(PostList);