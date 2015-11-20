"use strict";

define([
        'react',
        'jquery'],
    function (React, $) {

        var Select = React.createClass({
            render: function () {
                return (
                    <select
                        id={this.props.id}
                        onChange={this.props.onChange}
                        defaultValue={this.props.initialValue}
                        className={this.props.classNames.field}
                        >
                        {this.props.choices.map(function (choice) {
                            return <option key={choice.key} value={choice.value}>{choice.label}</option>;
                        })}
                    </select>
                );
            }
        });

        var FormField = React.createClass({

            getInitialState: function () {
                return {
                    value: ""
                };
            },

            getDefaultProps: function () {
                return {
                    id: "",
                    type: "",
                    label: "",
                    initialValue: "",
                    choices: [],

                    onChange: function () {},

                    error: {
                        message: ""
                    },

                    classNames: {
                        container: "",
                        label: "",
                        field: "",
                        error: ""
                    },

                    attributes: {}
                };
            },

            componentWillMount: function () {
                this.setState({
                    value: this.props.initialValue
                });
            },

            render: function () {
                var field = this._createFormFieldElement();
                var error = this.props.error;

                return (
                    <div className={this.props.classNames.container}>

                        { this.props.label ? (
                            <label className={this.props.classNames.label}
                                   htmlFor={this.props.id}>
                                {this.props.label}
                            </label>
                        ) : null }

                        {field}

                        { error && error.message ? (
                            <span className={this.props.classNames.error}>
                                {error.message}
                            </span>
                        ) : null }

                    </div>
                );
            },

            _onChange: function (e) {
                if (this.props.onChange.call(null, e) === false) {
                    e.preventDefault();
                    return;
                }

                this.setState({
                    value: e.target.value
                });
            },

            _createFormFieldElement () {

                var props = {
                    className: this.props.classNames.field,
                    id: this.props.id,
                    value: this.state.value,
                    onChange: this._onChange
                };

                props = $.extend(props, this.props.attributes);

                switch (this.props.type) {
                    case "text":
                    case "email":
                    case "password":
                    case "date":
                    default:
                        props.type = this.props.type;
                        return React.createElement("input", props);
                        break;
                    case "textarea":
                        return React.createElement("textarea", props);
                        break;
                    case "select":
                        return React.createElement(Select, this.props);
                        break;
                }
            }

        });

        return FormField;

    });
