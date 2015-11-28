"use strict";

define([
        'react',
        'services/global-events',
        'services/string-formatter',
        'services/server-facade',
        'services/extend',
        'jsx!components/form-field'
    ],
    function (React,
              GlobalEvents,
              StringFormatter,
              ServerFacade,
              extend,
              FormField) {

        var SettingEditor = React.createClass({

            getInitialState: function () {
                return {
                    errors: {
                        front: undefined
                    },
                    setting: {
                        front: null
                    },
                    blogs: [],
                    flush: ""
                };
            },

            componentWillMount: function () {
                ServerFacade.getSetting().then(function (setting) {
                    this._setSettingState(this.getInitialState().setting, setting);
                }.bind(this));

                ServerFacade.getBlogs().then(function (blogs) {
                    this.setState({blogs: blogs});
                }.bind(this));
            },

            render: function () {
                var frontField = React.createElement(FormField, {
                    field: {
                        type: "select",
                        value: this.state.setting.front,
                        onChange: function (value) {
                            var blog = this.state.blogs.find(function (b) {
                                return b._id === value;
                            });
                            this._setSettingState(this.state.setting, {front: blog ? blog._id : null});
                        }.bind(this),

                        children: this._addEmptySelectOption(this.state.blogs.map(function (blog) {
                            return {
                                key: blog._id,
                                value: blog._id,
                                label: blog.title
                            }
                        })),

                        autoFocus: true
                    },
                    label: {
                        children: "Front Page"
                    },
                    error: {
                        children: this.state.errors.front ? this.state.errors.front.message : ""
                    }
                });

                return (
                    <form className="module-data-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-dte-title">Setting</h2>

                        <div className="m-dte-field-container">
                            {frontField}
                        </div>
                        { this.state.flush ?
                            (
                                <div className="m-dte-field-container">
                                    <div className="m-dte-flush-message">
                                        {this.state.flush}
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className="m-dte-field-container">
                            <button className="module-button"
                                    type="submit">Edit
                            </button>
                        </div>
                    </form>
                );
            },

            _onSubmit: function (e) {
                e.preventDefault();

                this._updateSetting()
                    .then(function () {
                        this.setState({
                            flush: "Succeeded to update the setting!"
                        });
                    }.bind(this))
                    .fail(function (xhr) {
                        this.setState({
                            errors: xhr.responseJSON.errors,
                            flush: ""
                        });
                    }.bind(this));
            },

            _updateSetting: function () {

                var data = this._buildDataForHttpRequest();

                return ServerFacade.updateSetting(data);
            },

            _buildDataForHttpRequest: function () {

                var data = {};

                if (this.state.setting.front) {
                    data.front = this.state.setting.front;
                }

                return data;
            },

            _setSettingState: function (defaultSetting, setting) {
                this.setState({
                    setting: extend(defaultSetting, this._flatten(setting))
                });
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

        return SettingEditor;

    });
