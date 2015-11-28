"use strict";

define([
        'react',
        'moment',
        'services/global-events',
        'services/event',
        'services/server-facade'
    ],
    function (React,
              Moment,
              GlobalEvents,
              Event,
              ServerFacade) {


        var PostList = React.createClass({

            getInitialState: function () {
                return {
                    posts: [],
                    categories: [],
                    authors: [],
                    blogs: []
                };
            },

            componentDidMount: function () {

                ServerFacade.getCategories().then(function (categories) {
                    this.setState({
                        categories: categories
                    });
                }.bind(this));

                ServerFacade.getUsers().then(function (users) {
                    this.setState({
                        authors: users
                    });
                }.bind(this));

                ServerFacade.getBlogs().then(function (blogs) {
                    this.setState({
                        blogs: blogs
                    });
                }.bind(this));

                this.events.addButtonClicked.on(this.props.addButtonClicked);
                this.events.editButtonClicked.on(this.props.editButtonClicked);
                this.events.deleteButtonClicked.on(this.props.deleteButtonClicked);

                GlobalEvents.postCreated.on(this._retrieveDataAndUpdateList);
                GlobalEvents.postUpdated.on(this._retrieveDataAndUpdateList);
                GlobalEvents.postDeleted.on(this._retrieveDataAndUpdateList);

                this._retrieveDataAndUpdateList();
            },

            componentWillUnmount: function () {
                GlobalEvents.postCreated.off(this._retrieveDataAndUpdateList);
                GlobalEvents.postUpdated.off(this._retrieveDataAndUpdateList);
                GlobalEvents.postDeleted.off(this._retrieveDataAndUpdateList);
            },

            render: function () {
                return (
                    <div className="module-data-list">
                        <h2 className="m-dtl-title">Posts</h2>

                        <div>
                            <button className="module-button m-btn-clear m-dtl-add-button"
                                    onClick={this._onAddButtonClicked}
                                    title="Add"
                                >
                                <i className="fa fa-plus-square-o m-dtl-add-icon"></i>
                                Add
                            </button>
                        </div>
                        <table className="m-dtl-table">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th className="m-dtl-for-desktop"></th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Slug</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Blog</th>
                                <th>Tags</th>
                                <th>Publish Date</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th className="m-dtl-for-phone"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.posts.map(function (post, index) {

                                var none = <span className="m-dtl-none">(None)</span>;
                                var deleted = <span className="m-dtl-none">(Deleted)</span>;
                                var created = Moment(post.created).format("YYYY-MM-DD HH:mm Z");
                                var updated = Moment(post.updated).format("YYYY-MM-DD HH:mm Z");
                                var publish = Moment(post.publish_date).format("YYYY-MM-DD HH:mm Z");
                                var tags = post.tags && post.tags.length > 0 ? post.tags.join(', ') : none;

                                var author;
                                var category;
                                var blog;

                                if (!post.author) {
                                    author = none;
                                } else {
                                    author = this.state.authors.find(function (a) {
                                        return post.author === a._id;
                                    });
                                    author = author ? author.display_name : deleted;
                                }

                                if (!post.category) {
                                    category = none;
                                } else {
                                    category = this.state.categories.find(function (a) {
                                        return post.category === a._id;
                                    });
                                    category = category ? category.name : deleted;
                                }

                                if (!post.blog) {
                                    blog = none;
                                } else {
                                    blog = this.state.blogs.find(function (a) {
                                        return post.blog === a._id;
                                    });
                                    blog = blog ? blog.title : deleted;
                                }

                                return <PostListItem key={post._id}
                                                     id={post._id}
                                                     title={post.title}
                                                     content={post.content}
                                                     slug={post.slug}
                                                     category={category}
                                                     author={author}
                                                     blog={blog}
                                                     tags={tags}
                                                     created={created}
                                                     updated={updated}
                                                     publish={publish}
                                                     deleteButtonClickEvent={this.events.deleteButtonClicked}
                                                     editButtonClickEvent={this.events.editButtonClicked}
                                                     number={index+1}/>;
                            }.bind(this))}
                            </tbody>
                        </table>
                    </div>
                );
            },

            _retrieveDataAndUpdateList: function () {
                ServerFacade.getPosts()
                    .then(function (data) {
                        this.setState({
                            posts: data
                        });
                    }.bind(this))

                    .fail(function (xhr) {
                        console.error(xhr.responseJSON.errors);
                    }.bind(this));
            },

            _onAddButtonClicked: function (e) {
                e.preventDefault();
                this.events.addButtonClicked.fire();
            },

            events: {
                addButtonClicked: new Event(),
                editButtonClicked: new Event(),
                deleteButtonClicked: new Event()
            }
        });

        var PostListItem = React.createClass({

            render: function () {

                var buttons = (
                    <ul className="m-dtl-button-list">
                        <li className="m-dtl-button-list-item">
                            <button className="module-button m-btn-clear"
                                    onClick={this._onEditButtonClicked}>
                                <i title="Edit" className="fa fa-pencil-square-o m-dtl-edit-icon"></i>
                            </button>
                        </li>
                        <li className="m-dtl-button-list-item">
                            <button className="module-button m-btn-clear"
                                    onClick={this._onDeleteButtonClicked}>
                                <i title="Delete" className="fa fa-trash-o m-dtl-delete-icon"></i>
                            </button>
                        </li>
                    </ul>
                );

                return (
                    <tr>
                        <td data-label="No.">{this.props.number}</td>
                        <td className="m-dtl-no-wrap m-dtl-for-desktop">{buttons}</td>
                        <td data-label="Title" className="element-table-wrap">{this.props.title}</td>
                        <td data-label="Content" className="element-table-wrap">{this.props.content}</td>
                        <td data-label="Slug">{this.props.slug}</td>
                        <td data-label="Author">{this.props.author}</td>
                        <td data-label="Category">{this.props.category}</td>
                        <td data-label="Blog">{this.props.blog}</td>
                        <td data-label="Tags">{this.props.tags}</td>
                        <td data-label="Publish Date">{this.props.publish}</td>
                        <td data-label="Created Date">{this.props.created}</td>
                        <td data-label="Updated Date">{this.props.updated}</td>
                        <td className="m-dtl-no-wrap m-dtl-for-phone">{buttons}</td>
                    </tr>
                );
            },

            _onDeleteButtonClicked: function (e) {
                e.preventDefault();
                this.props.deleteButtonClickEvent.fire(this.props.id);
            },

            _onEditButtonClicked: function (e) {
                e.preventDefault();
                this.props.editButtonClickEvent.fire(this.props.id);
            }

        });

        return PostList;
    });

