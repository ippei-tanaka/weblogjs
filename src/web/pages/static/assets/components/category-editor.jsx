"use strict";

define([
        'react',
        'services/global-events',
        'services/string-formatter',
        'jquery',
        'jsx!components/form-field',
        'jsx!components/confirmation'
    ],
    function (React,
              GlobalEvents,
              StringFormatter,
              $,
              FormField,
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

                var nameField = React.createElement(FormField, {
                    field: {
                        type: "text",
                        value: this.state.category.name,
                        onChange: function (value) {
                            this._setCategoryState(this.state.category, {name: value});
                        }.bind(this),
                        autoFocus: true
                    },
                    label: {
                        children: "Category Name"
                    },
                    error: {
                        children: this.state.errors.name ? this.state.errors.name.message : ""
                    }
                });

                var slugField = React.createElement(FormField, {
                    field: {
                        type: "text",
                        value: this.state.category.slug,
                        onChange: function (value) {
                            this._setCategoryState(this.state.category, {slug: value});
                        }.bind(this)
                    },
                    label: {
                        children: "Slug"
                    },
                    error: {
                        children: this.state.errors.slug ? this.state.errors.slug.message : ""
                    }
                });

                var title = this._chooseByMode({add: "Create a new category", edit: "Edit the category"});

                var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

                return (
                    <form className="module-data-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-dte-title">{title}</h2>
                        <div className="m-dte-field-container">
                            {nameField}
                        </div>
                        <div className="m-dte-field-container">
                            {slugField}
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
                        Do you want to delete "{this.state.category.name}"?
                    </Confirmation>
                );
            },

            _inputFactory: function (props) {
                var defaultProps = {
                    classNames: {
                        container: "m-dte-field-container",
                        label: "m-dte-label",
                        field: "m-dte-input",
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

                var data = this._buildDataForHttpRequest();

                return this._sendHttpRequest(url, 'post', data)
                    .then(function () {
                        GlobalEvents.categoryCreated.fire();
                    });
            },

            _updateCategory: function () {

                var ajaxUrl = url + '/' + this.props.category._id;

                var data = this._buildDataForHttpRequest();

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

            _buildDataForHttpRequest: function () {

                var data = {
                    name: this.state.category.name.trim(),
                    slug: this.state.category.slug.trim()
                };

                if(data.slug === "") {
                    data.slug = StringFormatter.slugfy(data.name);
                    this._setCategoryState(this.state.category, {slug: data.slug});
                }

                return data;
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
