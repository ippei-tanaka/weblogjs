"use strict";

define([
        'react',
        'services/global-events',
        'services/string-formatter',
        'jquery',
        'jsx!components/form-field',
        'jsx!components/confirmation',
        'jsx!components/post-list',
        'jsx!components/user-list',
        'jsx!components/category-list'
    ],
    function (React,
              GlobalEvents,
              StringFormatter,
              $,
              FormField,
              Confirmation,
              PostList,
              UserList,
              CategoryList) {

        var url = "/api/v1/posts";

        var PostEditor = React.createClass({

            getInitialState: function () {
                return {
                    errors: {
                        title: undefined,
                        content: undefined,
                        slug: undefined,
                        author: undefined,
                        category: undefined,
                        tags: undefined,
                        publish_date: undefined
                    },
                    post: {
                        title: "",
                        content: "",
                        slug: "",
                        author: null,
                        category: null,
                        tags: [],
                        publish_date: new Date()
                    },
                    categories: [],
                    authors: []
                };
            },

            getDefaultProps: function () {
                return {
                    mode: "", // 'add', 'edit' or 'del'
                    postId: "",
                    onComplete: function () {}
                };
            },

            componentWillMount: function () {
                PostList.getPost(this.props.postId).then(function (post) {
                    this._setPostState(this.getInitialState().post, post);
                }.bind(this));

                CategoryList.getCategories().then(function (categories) {
                    this.setState({
                        categories: categories
                    });
                }.bind(this));

                UserList.getUsers().then(function (users) {
                    this.setState({
                        authors: users
                    });
                }.bind(this));

                UserList.getMe().then(function (me) {
                    if (!this.state.post.author) {
                        this._setPostState(this.state.post, {author: me});
                    }
                }.bind(this));
            },

            render: function () {
                return this._chooseByMode({
                    add: this._renderForm,
                    edit: this._renderForm,
                    del: this._renderConfirmation
                })();
            },

            _renderForm: function () {

                var titleField = React.createElement(FormField, {
                    field: {
                        type: "text",
                        value: this.state.post.title,
                        onChange: function (value) {
                            this._setPostState(this.state.post, {title: value});
                        }.bind(this),
                        autoFocus: true
                    },
                    label: {
                        children: "Title"
                    },
                    error: {
                        children: this.state.errors.title ? this.state.errors.title.message : ""
                    }
                });

                var contentField = React.createElement(FormField, {
                    field: {
                        type: "textarea",
                        value: this.state.post.content,
                        onChange: function (value) {
                            this._setPostState(this.state.post, {content: value});
                        }.bind(this)
                    },
                    label: {
                        children: "Content"
                    },
                    error: {
                        children: this.state.errors.content ? this.state.errors.content.message : ""
                    }
                });

                var slugField = React.createElement(FormField, {
                    field: {
                        type: "text",
                        value: this.state.post.slug,
                        onChange: function (value) {
                            this._setPostState(this.state.post, {slug: value});
                        }.bind(this)
                    },
                    label: {
                        children: "Slug"
                    },
                    error: {
                        children: this.state.errors.slug ? this.state.errors.slug.message : ""
                    }
                });

                var authorField = React.createElement(FormField, {
                    field: {
                        type: "select",
                        value: this.state.post.author ? this.state.post.author._id : null,
                        onChange: function (value) {
                            var author = this.state.authors.find(function (a) { return a._id === value; });
                            this._setPostState(this.state.post, {author: author});
                        }.bind(this),
                        children: this._addEmptySelectOption(this.state.authors.map(function (author) {
                            return {
                                key: author._id,
                                value: author._id,
                                label: author.display_name
                            }
                        }))
                    },
                    label: {
                        children: "Author"
                    },
                    error: {
                        children: this.state.errors.author ? this.state.errors.author.message : ""
                    }
                });

                var categoryField = React.createElement(FormField, {
                    field: {
                        type: "select",
                        value: this.state.post.category ? this.state.post.category._id : null,
                        onChange: function (value) {
                            var category = this.state.categories.find(function (a) { return a._id === value; });
                            this._setPostState(this.state.post, {category: category});
                        }.bind(this),
                        children: this._addEmptySelectOption(this.state.categories.map(function (category) {
                            return {
                                key: category._id,
                                value: category._id,
                                label: category.name
                            }
                        }))
                    },
                    label: {
                        children: "Category"
                    },
                    error: {
                        children: this.state.errors.category ? this.state.errors.category.message : ""
                    }
                });

                var tagListField = React.createElement(FormField, {
                    field: {
                        type: "tag-list",
                        value: this.state.post.tags,
                        onChange: function (value) {
                            this._setPostState(this.state.post, {tags: value});
                        }.bind(this)
                    },
                    label: {
                        children: "Tags"
                    },
                    error: {
                        children: this.state.errors.tags ? this.state.errors.tags.message : ""
                    }
                });

                var publishDateField = React.createElement(FormField, {
                    field: {
                        type: "datetime",
                        value: this.state.post.publish_date,
                        onChange: function (value) {
                            this._setPostState(this.state.post, {publish_date: value});
                        }.bind(this)
                    },
                    label: {
                        children: "Publish Date"
                    },
                    error: {
                        children: this.state.errors.publish_date ? this.state.errors.publish_date.message : ""
                    }
                });

                var title = this._chooseByMode({add: "Create a New Post", edit: "Edit the Post"});

                var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

                return (
                    <form className="module-data-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-dte-title">{title}</h2>
                        <div className="m-dte-field-container">
                            {titleField}
                        </div>
                        <div className="m-dte-field-container">
                            {contentField}
                        </div>
                        <div className="m-dte-field-container">
                            {slugField}
                        </div>
                        <div className="m-dte-field-container">
                            {authorField}
                        </div>
                        <div className="m-dte-field-container">
                            {categoryField}
                        </div>
                        <div className="m-dte-field-container">
                            {tagListField}
                        </div>
                        <div className="m-dte-field-container">
                            {publishDateField}
                        </div>
                        <div className="m-dte-field-container">
                            <button className="module-button"
                                    type="submit">{buttonLabel}</button>
                        </div>
                    </form>
                );
            },

            _renderConfirmation: function () {
                return (
                    <Confirmation
                        mode="choose"
                        onApproved={this._onDeleteApproved}
                        onCanceled={this._onDeleteCanceled}
                        >
                        Do you want to delete "{this.state.post.title}"?
                    </Confirmation>
                );
            },

            _onSubmit: function (e) {
                e.preventDefault();

                var ajaxFunc = this._chooseByMode({
                    add: this._createPost,
                    edit: this._updatePost
                });

                ajaxFunc()
                    .then(function () {
                        this.setState(this.getInitialState());
                        this.props.onComplete();
                    }.bind(this))
                    .fail(function (xhr) {
                        this.setState({
                            errors: xhr.responseJSON.errors
                        });
                    }.bind(this));
            },

            _onDeleteApproved: function () {
                this._deletePost().then(function () {
                    this.props.onComplete();
                }.bind(this)).fail(function (xhr) {
                    console.error(xhr.responseJSON.errors);
                });
            },

            _onDeleteCanceled: function () {
                this.props.onComplete();
            },

            _createPost: function () {

                var data = this._buildDataForHttpRequest();

                return this._sendHttpRequest(url, 'post', data)
                    .then(function () {
                        GlobalEvents.postCreated.fire();
                    });
            },

            _updatePost: function () {

                var ajaxUrl = url + '/' + this.props.postId;

                var data = this._buildDataForHttpRequest();

                return this._sendHttpRequest(ajaxUrl, 'put', data)
                    .then(function () {
                        GlobalEvents.postUpdated.fire();
                    });
            },

            _deletePost: function () {
                var ajaxUrl = url + '/' + this.props.postId;

                return this._sendHttpRequest(ajaxUrl, 'delete')
                    .then(function () {
                        GlobalEvents.postDeleted.fire();
                    });
            },

            _buildDataForHttpRequest: function () {
                var data = {
                    title: this.state.post.title.trim(),
                    content: this.state.post.content.trim(),
                    category: this.state.post.category ? this.state.post.category._id : "",
                    author: this.state.post.author ? this.state.post.author._id : "",
                    tags: this.state.post.tags,
                    publish_date: this.state.post.publish_date,
                    slug: this.state.post.slug.trim()
                };

                if(data.slug === "") {
                    data.slug = StringFormatter.slugfy(data.title);
                    this._setPostState(this.state.post, {slug: data.slug});
                }

                return data;
            },

            _sendHttpRequest: function (url, method, data) {
                var options = {
                    url: url,
                    dataType: 'json',
                    cache: false,
                    method: method,
                    traditional: true
                };

                if (data) {
                    options.data = data;
                }

                return $.ajax(options);
            },

            _setPostState: function (defaultPost, post) {
                this.setState({
                    post: $.extend(defaultPost, this._flatten(post))
                });
            },

            _chooseByMode: function (options) {
                if (this.props.mode === 'add') {
                    return options.add;
                } else if (this.props.mode === 'edit') {
                    return options.edit;
                } else if (this.props.mode === 'del') {
                    return options.del;
                } else {
                    throw new Error('Mode should have been selected.');
                }
            },

            _flatten: function (obj) {
                var newObj = {};

                Object.keys(obj).forEach(function (key) {
                    if (typeof obj[key] !== 'undefined') {
                        newObj[key] = obj[key];
                    }
                });

                return newObj;
            },

            _addEmptySelectOption: function (array) {
                array = array || [];
                array.unshift({
                    key: "---------",
                    value: "",
                    label: "None"
                });
                return array;
            }
        });

        return PostEditor;

    });
