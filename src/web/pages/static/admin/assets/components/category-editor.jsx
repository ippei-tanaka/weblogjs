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
                    categoryId: "",
                    onComplete: function () {
                    }
                };
            },

            componentWillMount: function () {
                if (this.props.mode === "edit") {
                    ServerFacade.getCategory(this.props.categoryId).then(function (category) {
                        this._setCategoryState(this.getInitialState().category, category);
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

                var title = this._chooseByMode({add: "Create a New Category", edit: "Edit the Category"});

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

                return ServerFacade.createCategory(data)
                    .then(function () {
                        GlobalEvents.categoryCreated.fire();
                    });
            },

            _updateCategory: function () {

                var data = this._buildDataForHttpRequest();

                return ServerFacade.updateCategory(this.props.categoryId, data)
                    .then(function () {
                        GlobalEvents.categoryUpdated.fire();
                    });
            },

            _deleteCategory: function () {
                return ServerFacade.deleteCategory(this.props.categoryId)
                    .then(function () {
                        GlobalEvents.categoryDeleted.fire();
                    });
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
                    category: extend(defaultCategory, this._flatten(category))
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
