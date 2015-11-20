"use strict";

define([
        'react',
        'services/global-events',
        'jquery',
        'jsx!components/input-field',
        'jsx!components/confirmation'
    ],
    function (React,
              GlobalEvents,
              $,
              InputField,
              Confirmation) {

        var url = "/api/v1/categories";

        var CategoryEditor = React.createClass({

            getInitialState: function () {
                return {
                    errors: {
                        name: undefined,
                        slug: undefined
                    },
                    category: {
                        name: "",
                        slug: ""
                    }
                };
            },

            getDefaultProps: function () {
                return {
                    mode: "", // 'add', 'edit' or 'del'
                    category: {
                        _id: "",
                        name: "",
                        slug: ""
                    },
                    onComplete: function () {
                    }
                };
            },

            componentWillMount: function () {
                this._setCategoryState(this.getInitialState().category, this.props.category);
            },

            render: function () {
                return this._chooseByMode({
                    add: this._renderForm,
                    edit: this._renderForm,
                    del: this._renderConfirmation
                })();
            },

            _renderForm: function () {

                var nameField = this._inputFactory({
                    id: "CategoryEditorNameInput",
                    type: "text",
                    initialValue: this.state.category.name,
                    error: this.state.errors.name,
                    onChange: function (e) {
                        this._setCategoryState(this.state.category, {name: e.target.value});
                    }.bind(this),
                    attributes: {
                        ref: this._autoFocus
                    },
                    label: "Category Name"
                });

                var slugField = this._inputFactory({
                    id: "CategoryEditorSlugInput",
                    type: "text",
                    initialValue: this.state.category.slug,
                    error: this.state.errors.slug,
                    onChange: function (e) {
                        this._setCategoryState(this.state.category, {slug: e.target.value});
                    }.bind(this),
                    label: "Slug"
                });

                var title = this._chooseByMode({add: "Create a new category", edit: "Edit the category"});

                var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

                return (
                    <form className="module-data-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-dte-title">{title}</h2>
                        {nameField}
                        {slugField}
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
                        Do you want to delete "{this.state.category.name}"?
                    </Confirmation>
                );
            },

            _inputFactory: function (props) {
                var defaultProps = {
                    classNames: {
                        container: "m-dte-field-container",
                        label: "m-dte-label",
                        input: "m-dte-input",
                        error: "m-dte-error"
                    }
                };
                return React.createElement(InputField, $.extend(defaultProps, props));
            },

            _onSubmit: function (e) {
                e.preventDefault();

                var ajaxFunc = this._chooseByMode({
                    add: this._createCategory,
                    edit: this._updateCategory
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
                this._deleteCategory().then(function () {
                    this.props.onComplete();
                }.bind(this)).fail(function (xhr) {
                    console.error(xhr.responseJSON.errors);
                });
            },

            _onDeleteCanceled: function () {
                this.props.onComplete();
            },

            _createCategory: function () {

                var data = {
                    name: this.state.category.name.trim(),
                    slug: this.state.category.slug.trim()
                };

                return this._sendHttpRequest(url, 'post', data)
                    .then(function () {
                        GlobalEvents.categoryCreated.fire();
                    });
            },

            _updateCategory: function () {

                var ajaxUrl = url + '/' + this.props.category._id;

                var data = {
                    name: this.state.category.name.trim(),
                    slug: this.state.category.slug.trim()
                };

                return this._sendHttpRequest(ajaxUrl, 'put', data)
                    .then(function () {
                        GlobalEvents.categoryUpdated.fire();
                    });
            },

            _deleteCategory: function () {
                var ajaxUrl = url + '/' + this.props.category._id;

                return this._sendHttpRequest(ajaxUrl, 'delete')
                    .then(function () {
                        GlobalEvents.categoryDeleted.fire();
                    });
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

            _setCategoryState: function (defaultCategory, category) {
                this.setState({
                    category: $.extend(defaultCategory, this._flatten(category))
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

        return CategoryEditor;

    });
