"use strict";

define([
        'react',
        'moment',
        'services/global-events',
        'services/event',
        'jquery'
    ],
    function (React,
              Moment,
              GlobalEvents,
              Event,
              $) {

        var url = "/api/v1/posts";

        var PostList = React.createClass({

            statics: {
                getPosts: function () {
                    return $.ajax({
                        url: url,
                        dataType: 'json',
                        cache: false
                    })
                        .then(function (data) {
                            return data.items;
                        });
                },

                getPost: function (id) {
                    return $.ajax({
                        url: url + "/" + id,
                        dataType: 'json',
                        cache: false
                    })
                        .then(function (data) {
                            return data;
                        });
                }
            },

            getInitialState: function () {
                return {
                    posts: []
                };
            },

            componentDidMount: function () {
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
                this.constructor.getPosts()
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
                        <h2 className="m-dtl-title">Post List</h2>
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
                                <th>Tags</th>
                                <th>Publish Date</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.posts.map(function (post, index) {
                                return <CategoryListItem key={post._id} post={post} events={this.events}
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
                var author = this.props.post.author ? (this.props.post.author.display_name || none) : none;
                var category = this.props.post.category ? (this.props.post.category.name || none) : none;
                var tags = this.props.post.tags && this.props.post.tags.length > 0 ? this.props.post.tags.join(', ') : none;

                return (
                    <tr>
                        <td data-label="No.">{this.props.number}</td>
                        <td data-label="Title" className="element-table-wrap">{this.props.post.title}</td>
                        <td data-label="Content" className="element-table-wrap">{this.props.post.content}</td>
                        <td data-label="Slug">{this.props.post.slug}</td>
                        <td data-label="Author">{author}</td>
                        <td data-label="Category">{category}</td>
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

