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

            render: function () {
                return (
                    <div className="module-data-list">
                        <h2 className="m-dtl-title">Posts</h2>
                        <div>
                            <button className="module-button m-btn-clear m-dtl-add-button"
                                    onClick={this.onAddButtonClicked}
                                    title="Add"
                                >
                                <i  className="fa fa-plus-square-o m-dtl-add-icon"></i>
                                Add
                            </button>
                        </div>
                        <table className="m-dtl-table">
                            <thead>
                            <tr>
                                <th>#</th>
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
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.posts.map(function (post, index) {
                                var author = this.state.authors.find(function (a) { return post.author === a._id; });
                                var category = this.state.categories.find(function (c) { return post.category === c._id; });
                                var blog = this.state.blogs.find(function (a) { return post.blog === a._id; });

                                blog = blog ? blog.title : null;
                                author = author ? author.display_name : null;
                                category = category ? category.name : null;

                                return <CategoryListItem key={post._id}
                                                         post={post}
                                                         category={category}
                                                         author={author}
                                                         blog={blog}
                                                         events={this.events}
                                                         number={index+1}/>;
                            }.bind(this))}
                            </tbody>
                        </table>
                    </div>
                );
            },

            onAddButtonClicked: function (e) {
                e.preventDefault();
                this.events.addButtonClicked.fire();
            },

            events: {
                addButtonClicked: new Event(),
                editButtonClicked: new Event(),
                deleteButtonClicked: new Event()
            }
        });

        var CategoryListItem = React.createClass({

            render: function () {

                var none = <span className="m-dtl-none">(None)</span>;
                var created = Moment(this.props.post.created).format("YYYY-MM-DD HH:mm Z");
                var updated = Moment(this.props.post.updated).format("YYYY-MM-DD HH:mm Z");
                var publish = Moment(this.props.post.publish_date).format("YYYY-MM-DD HH:mm Z");
                var author = this.props.author || none;
                var category = this.props.category || none;
                var blog = this.props.blog || none;
                var tags = this.props.post.tags && this.props.post.tags.length > 0 ? this.props.post.tags.join(', ') : none;

                return (
                    <tr>
                        <td data-label="No.">{this.props.number}</td>
                        <td data-label="Title" className="element-table-wrap">{this.props.post.title}</td>
                        <td data-label="Content" className="element-table-wrap">{this.props.post.content}</td>
                        <td data-label="Slug">{this.props.post.slug}</td>
                        <td data-label="Author">{author}</td>
                        <td data-label="Category">{category}</td>
                        <td data-label="Blog">{blog}</td>
                        <td data-label="Tags">{tags}</td>
                        <td data-label="Publish Date">{publish}</td>
                        <td data-label="Created Date">{created}</td>
                        <td data-label="Updated Date">{updated}</td>
                        <td className="m-dtl-no-wrap">
                            <ul className="m-dtl-button-list">
                                <li className="m-dtl-button-list-item">
                                    <button className="module-button m-btn-clear"
                                            onClick={this.onEditButtonClicked}>
                                        <i title="Edit" className="fa fa-pencil-square-o m-dtl-edit-icon"></i>
                                    </button>
                                </li>
                                <li className="m-dtl-button-list-item">
                                    <button className="module-button m-btn-clear"
                                            onClick={this.onDeleteButtonClicked}>
                                        <i title="Delete" className="fa fa-trash-o m-dtl-delete-icon"></i>
                                    </button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                );
            },

            onDeleteButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.deleteButtonClicked.fire(this.props.post);
            },

            onEditButtonClicked: function (e) {
                e.preventDefault();
                this.props.events.editButtonClicked.fire(this.props.post);
            }

        });

        return PostList;
    });

