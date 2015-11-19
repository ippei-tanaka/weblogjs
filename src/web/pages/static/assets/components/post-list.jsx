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
                    <div className="module-post-list">
                        <h2 className="m-psl-title">Post List</h2>

                        <table className="m-psl-table">
                            <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th>#</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Slug</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Tags</th>
                                <th>Publish Date</th>
                                <th className="m-psl-hidden-cell">Created</th>
                                <th className="m-psl-hidden-cell">Updated</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.posts.map(function (post, index) {
                                return <CategoryListItem key={post._id} post={post} events={this.events}
                                                         number={index+1}/>;
                            }.bind(this))}
                            </tbody>
                        </table>

                        <div>
                            <button className="module-button m-btn-clear m-psl-add-button"
                                    onClick={this.onAddButtonClicked}><i
                                className="fa fa-plus-square-o m-psl-add-icon"></i> Add
                            </button>
                        </div>
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

                var created = Moment(this.props.post.created).format("YYYY-MM-DD HH:mm Z");
                var updated = Moment(this.props.post.updated).format("YYYY-MM-DD HH:mm Z");
                var publish = Moment(this.props.post.publish_date).format("YYYY-MM-DD HH:mm Z");
                var author = this.props.post.author ? (this.props.post.author.display_name || "") : "";
                var category = this.props.post.category ? (this.props.post.category.name || "") : "";

                return (
                    <tr>
                        <td className="m-psl-center">
                            <button className="module-button m-btn-clear" onClick={this.onEditButtonClicked}><i
                                title="Edit" className="fa fa-pencil-square-o m-psl-edit-icon"></i></button>
                        </td>
                        <td className="m-psl-center">
                            <button className="module-button m-btn-clear" onClick={this.onDeleteButtonClicked}><i
                                title="Delete" className="fa fa-trash-o m-psl-delete-icon"></i></button>
                        </td>
                        <td>{this.props.number}</td>
                        <td>{this.props.post.title}</td>
                        <td>{this.props.post.content}</td>
                        <td>{this.props.post.slug}</td>
                        <td>{author}</td>
                        <td>{category}</td>
                        <td>{this.props.post.tags}</td>
                        <td>{publish}</td>
                        <td className="m-psl-hidden-cell">{created}</td>
                        <td className="m-psl-hidden-cell">{updated}</td>
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

