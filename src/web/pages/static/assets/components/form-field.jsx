"use strict";

define([
        'react',
        'jquery'],
    function (React, $) {

        var Field = React.createClass({
            getDefaultProps: function () {
                return {
                    id: "",
                    type: "text",
                    className: "",
                    baseClassName: "m-frf-",
                    value: "",
                    onChange: function () {}
                };
            },

            getInitialState: function () {
                return {
                    value: ""
                };
            },

            componentWillMount: function () {
                this.setState({
                    value: this.props.value
                });
            },

            componentWillReceiveProps: function (newProps) {
                this.setState({
                    value: newProps.value
                });
            },

            render: function () {

                var props = $.extend({}, this.props);

                //
                delete props.children;

                //
                props.className = props.className || props.baseClassName + props.type;
                delete props.baseClassName;

                //
                props.value = this.state.value;
                props.onChange = this._onChange;

                if (props.type === "textarea") {
                    return React.createElement("textarea", props);
                } else if (props.type === "select") {
                    var options = this.props.children.map(function (child) {
                        return React.createElement("option", child);
                    });
                    return React.createElement("select", props, options);
                } else {
                    return React.createElement("input", props);
                }
            },

            _onChange: function (e) {
                var value = e.target.value;

                if (this.props.onChange(value) === false) {
                    e.preventDefault();
                    return;
                }

                this.setState({
                    value: value
                });
            }

        });

        var Label = React.createClass({
            getDefaultProps: function () {
                return {
                    id: "",
                    className: "m-frf-label"
                };
            },

            render: function () {
                return (
                    <label className={this.props.className}
                           htmlFor={this.props.id}>
                        {this.props.children}
                    </label>
                );
            }
        });

        var Error = React.createClass({
            getDefaultProps: function () {
                return {
                    className: "m-frf-error"
                };
            },

            render: function () {
                return (
                    <span className={this.props.className}>
                        {this.props.children}
                    </span>
                );
            }
        });

        var FormField = React.createClass({
            getDefaultProps: function () {
                return {
                    containerClassName: "module-form-field",
                    field: {},
                    label: {},
                    error: {}
                };
            },

            render: function () {
                var id = this.props.field.id || this._generateId();
                var fieldProps = $.extend(this.props.field, { id: id });
                var labelProps = $.extend(this.props.label, { id: id });

                var field = React.createElement(Field, fieldProps);
                var label = React.createElement(Label, labelProps);
                var error = React.createElement(Error, this.props.error);

                return (
                    <div className={this.props.containerClassName}>
                        { label }
                        { field }
                        { error }
                    </div>
                );
            },

            _generateId: function () {
                var id = "FormField";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var length = 12;

                for( var i=0; i < length; i++ ) {
                    id += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                return id;
            }
        });

        return FormField;

    });
