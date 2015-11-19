"use strict";

define([
        'react',
        'services/global-events',
        'jquery',
        'jsx!components/input-field',
        'jsx!components/textarea-field',
        'jsx!components/confirmation',
        'jsx!components/user-list',
        'jsx!components/category-list'
    ],
    function (React,
              GlobalEvents,
              $,
              InputField,
              TextareaField,
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

                var titleField = this._formElementFactory(InputField, {
                    id: "PostEditorTitleInput",
                    type: "text",
                    initialValue: this.state.post.title,
                    error: this.state.errors.title,
                    onChange: function (e) {
                        this._setPostState(this.state.post, {title: e.target.value});
                    }.bind(this),
                    attributes: {
                        ref: this._autoFocus
                    },
                    label: "Title"
                });

                var contentField = this._formElementFactory(TextareaField, {
                    id: "PostEditorContentInput",
                    initialValue: this.state.post.content,
                    error: this.state.errors.content,
                    onChange: function (e) {
                        this._setPostState(this.state.post, {content: e.target.value});
                    }.bind(this),
                    label: "Content"
                });

                var slugField = this._formElementFactory(InputField, {
                    id: "PostEditorSlugInput",
                    type: "text",
                    initialValue: this.state.post.slug,
                    error: this.state.errors.slug,
                    onChange: function (e) {
                        this._setPostState(this.state.post, {slug: e.target.value});
                    }.bind(this),
                    label: "Slug"
                });

                var publishDateField = this._formElementFactory(InputField, {
                    id: "PostEditorSlugInput",
                    type: "date",
                    initialValue: this.state.post.publish_date,
                    error: this.state.errors.publish_date,
                    onChange: function (e) {
                        var string = e.target.value;
                        this._setPostState(this.state.post, {publish_date: new Date(string)});
                    }.bind(this),
                    label: "Publish Date"
                });

                var title = this._chooseByMode({add: "Post", edit: "Edit the post"});

                var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

                return (
                    <form className="module-post-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-pse-title">{title}</h2>
                        {titleField}
                        {contentField}
                        {slugField}
                        <select onChange={function (e) { this._setPostState(this.state.post, {category: e.target.value}); }.bind(this)}>
                            {this.state.categories.map(function (category, index) {
                                return <option selected={this.state.post.category._id === category._id} key={category._id} value={category._id}>{category.name}</option>;
                            }.bind(this))}
                        </select>
                        {publishDateField}
                        <div className="m-pse-field-container">
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

            _formElementFactory: function (reactClass, props) {
                var defaultProps = {
                    classNames: {
                        container: "m-pse-field-container",
                        label: "m-pse-label",
                        input: "m-pse-input",
                        textarea: "m-pse-textarea",
                        error: "m-pse-error"
                    }
                };
                return React.createElement(reactClass, $.extend(defaultProps, props));
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

            _autoFocus: function (input) {
                if (input != null) {
                    input.focus();
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
