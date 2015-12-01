"use strict";

define([
        'react',
        'services/global-events',
        'services/string-formatter',
        'services/server-facade',
        'services/extend',
        'jsx!components/form-field',
        'jsx!components/confirmation'
    ],
    function (React,
              GlobalEvents,
              StringFormatter,
              ServerFacade,
              extend,
              FormField,
              Confirmation) {

        var SettingEditor = React.createClass({

            getInitialState: function () {
                return {
                    errors: {
                        posts_per_page: undefined,
                        slug: undefined,
                        title: undefined
                    },
                    blog: {
                        posts_per_page: "",
                        slug: "",
                        title: ""
                    }
                };
            },

            getDefaultProps: function () {
                return {
                    mode: "", // 'add', 'edit' or 'del'
                    blogId: "",
                    onComplete: function () {
                    }
                };
            },

            componentWillMount: function () {
                if (this.props.mode === "edit" || this.props.mode === "del") {
                    ServerFacade.getBlog(this.props.blogId).then(function (blog) {
                        this._setBlogState(this.getInitialState().blog, blog);
                    }.bind(this));
                }
            },

            render: function () {
                return this._chooseByMode({
                    add: this._renderForm,
                    edit: this._renderForm,
                    del: this._renderConfirmation
                })();
            },

            _renderForm: function () {

                var slugField = React.createElement(FormField, {
                    field: {
                        type: "text",
                        value: this.state.blog.slug,
                        onChange: function (value) {
                            this._setBlogState(this.state.blog, {slug: value});
                        }.bind(this)
                    },
                    label: {
                        children: "Slug"
                    },
                    error: {
                        children: this.state.errors.slug ? this.state.errors.slug.message : ""
                    }
                });

                var titleField = React.createElement(FormField, {
                    field: {
                        type: "text",
                        value: this.state.blog.title,
                        onChange: function (value) {
                            this._setBlogState(this.state.blog, {title: value});
                        }.bind(this)
                    },
                    label: {
                        children: "Title"
                    },
                    error: {
                        children: this.state.errors.title ? this.state.errors.title.message : ""
                    }
                });

                var postsPerPageOptions = [{
                    key: -1,
                    value: null,
                    label: "None"
                }];

                postsPerPageOptions = postsPerPageOptions.concat([1, 5, 10, 15, 20, 30]
                    .map(function (number, index) {
                        return {
                            key: index,
                            value: number,
                            label: number
                        }
                    }));

                var postsPerPageField = React.createElement(FormField, {
                    field: {
                        type: "select",
                        value: this.state.blog.posts_per_page,
                        onChange: function (value) {
                            this._setBlogState(this.state.blog, {posts_per_page: value});
                        }.bind(this),

                        children: postsPerPageOptions,

                        autoFocus: true
                    },
                    label: {
                        children: "Posts Per Page"
                    },
                    error: {
                        children: this.state.errors.posts_per_page ? this.state.errors.posts_per_page.message : ""
                    }
                });

                var title = this._chooseByMode({add: "Create a New Blog", edit: "Edit the Blog"});

                var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

                return (
                    <form className="module-data-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-dte-title">{title}</h2>

                        <div className="m-dte-field-container">
                            {titleField}
                        </div>
                        <div className="m-dte-field-container">
                            {slugField}
                        </div>
                        <div className="m-dte-field-container">
                            {postsPerPageField}
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
                        Do you want to delete "{this.state.blog.title}"?
                    </Confirmation>
                );
            },

            _onSubmit: function (e) {
                e.preventDefault();

                var ajaxFunc = this._chooseByMode({
                    add: this._createBlog,
                    edit: this._updateBlog
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
                this._deleteBlog().then(function () {
                    this.props.onComplete();
                }.bind(this)).fail(function (xhr) {
                    console.error(xhr.responseJSON.errors);
                });
            },

            _onDeleteCanceled: function () {
                this.props.onComplete();
            },

            _createBlog: function () {

                var data = this._buildDataForHttpRequest();

                return ServerFacade.createBlog(data)
                    .then(function () {
                        GlobalEvents.blogCreated.fire();
                    });
            },

            _updateBlog: function () {

                var data = this._buildDataForHttpRequest();

                return ServerFacade.updateBlog(this.props.blogId, data)
                    .then(function () {
                        GlobalEvents.blogUpdated.fire();
                    });
            },

            _deleteBlog: function () {
                return ServerFacade.deleteBlog(this.props.blogId)
                    .then(function () {
                        GlobalEvents.blogDeleted.fire();
                    });
            },

            _buildDataForHttpRequest: function () {

                var data = {
                    posts_per_page: this.state.blog.posts_per_page,
                    slug: this.state.blog.slug.trim(),
                    title: this.state.blog.title.trim()
                };

                if (data.slug === "") {
                    data.slug = StringFormatter.slugfy(data.posts_per_page);
                    this._setBlogState(this.state.blog, {slug: data.slug});
                }

                return data;
            },

            _setBlogState: function (defaultBlog, blog) {
                this.setState({
                    blog: extend(defaultBlog, this._flatten(blog))
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

        return SettingEditor;

    });
