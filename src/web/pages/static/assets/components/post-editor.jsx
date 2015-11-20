"use strict";

define([
        'react',
        'services/global-events',
        'jquery',
        'jsx!components/form-field1',
        'jsx!components/confirmation',
        'jsx!components/user-list',
        'jsx!components/category-list'
    ],
    function (React,
              GlobalEvents,
              $,
              FormField,
              Confirmation,
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
                    categories: []
                };
            },

            getDefaultProps: function () {
                return {
                    mode: "", // 'add', 'edit' or 'del'
                    post: {
                        _id: "",
                        title: "",
                        content: "",
                        slug: "",
                        author: null,
                        category: null,
                        tags: [],
                        publish_date: new Date()
                    },
                    onComplete: function () {
                    }
                };
            },

            componentWillMount: function () {
                this._setPostState(this.getInitialState().post, this.props.post);

                CategoryList.getCategories().then(function (categories) {
                    this.setState({
                        categories: categories
                    });
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

                var contentField = this._formElementFactory({
                    id: "PostEditorContentInput",
                    type: "textarea",
                    initialValue: this.state.post.content,
                    error: this.state.errors.content,
                    onChange: function (e) {
                        this._setPostState(this.state.post, {content: e.target.value});
                    }.bind(this),
                    classNames: {
                        field: "m-dte-textarea"
                    },
                    label: "Content"
                });

                var slugField = this._formElementFactory({
                    id: "PostEditorSlugInput",
                    type: "text",
                    initialValue: this.state.post.slug,
                    error: this.state.errors.slug,
                    onChange: function (e) {
                        this._setPostState(this.state.post, {slug: e.target.value});
                    }.bind(this),
                    classNames: {
                        field: "m-dte-input"
                    },
                    label: "Slug"
                });

                var categoryField = React.createElement(FormField, {
                    field: {
                        type: "select",
                        value: this.state.post.category ? this.state.post.category._id : null,
                        onChange: function (value) {
                            this._setPostState(this.state.post, {category: value});
                        }.bind(this),
                        children: this.state.categories.map(function (category) {
                            return {
                                key: category._id,
                                value: category._id,
                                label: category.name
                            }
                        })
                    },
                    label: {
                        children: "Category"
                    },
                    error: {
                        children: this.state.errors.category ? this.state.errors.category.message : ""
                    }
                });


                var publishDateField = this._formElementFactory({
                    id: "PostEditorSlugInput",
                    type: "date",
                    initialValue: this.state.post.publish_date,
                    error: this.state.errors.publish_date,
                    onChange: function (e) {
                        var string = e.target.value;
                        this._setPostState(this.state.post, {publish_date: new Date(string)});
                    }.bind(this),
                    classNames: {
                        field: "m-dte-input"
                    },
                    label: "Publish Date"
                });

                var title = this._chooseByMode({add: "Post", edit: "Edit the post"});

                var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

                return (
                    <form className="module-data-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-dte-title">{title}</h2>
                        {titleField}
                        {contentField}
                        {slugField}
                        {categoryField}
                        {publishDateField}
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

            _formElementFactory: function (props) {
                var defaultProps = {
                    classNames: {
                        container: "m-dte-field-container",
                        label: "m-dte-label",
                        error: "m-dte-error"
                    }
                };

                return React.createElement(FormField, $.extend(true, defaultProps, props));
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

                var ajaxUrl = url + '/' + this.props.post._id;

                var data = this._buildDataForHttpRequest();

                return this._sendHttpRequest(ajaxUrl, 'put', data)
                    .then(function () {
                        GlobalEvents.postUpdated.fire();
                    });
            },

            _deletePost: function () {
                var ajaxUrl = url + '/' + this.props.post._id;

                return this._sendHttpRequest(ajaxUrl, 'delete')
                    .then(function () {
                        GlobalEvents.postDeleted.fire();
                    });
            },

            _buildDataForHttpRequest: function () {
                return {
                    title: this.state.post.title.trim(),
                    content: this.state.post.content.trim(),
                    category: this.state.post.category,
                    publish_date: this.state.post.publish_date,
                    slug: this.state.post.slug.trim()
                }
            },

            _sendHttpRequest: function (url, method, data) {
                var options = {
                    url: url,
                    dataType: 'json',
                    cache: false,
                    method: method
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
            }
        });

        return PostEditor;

    });
