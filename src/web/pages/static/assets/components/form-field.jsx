"use strict";

define([
        'react',
        'jquery'],
    function (React, $) {

        var FormField = React.createClass({

            getInitialState: function () {
                return {
                    error: "",
                    value: ""
                };
            },

            getDefaultProps: function () {
                return {
                    id: "",
                    type: "",
                    label: "",
                    initialValue: "",

                    onChange: function () {
                    },

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
                    value: this.props.initialValue,
                    error: this.props.error
                });
            },

            componentWillReceiveProps: function (newProps) {
                this.setState({
                    error: newProps.error
                });
            },

            render: function () {

                var field = this._createFormFieldElement();

                return (
                    <div className={this.props.classNames.container}>
                        <label className={this.props.classNames.label}
                               htmlFor={this.props.id}>{this.props.label}</label>

                        {field}

                        { this.state.error
                            ? (<span className={this.props.classNames.error}>{this.state.error.message}</span>)
                            : null }
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

                var elementName = "";

                switch (this.props.type) {
                    case "text":
                    case "email":
                    case "password":
                    case "date":
                        props.type = this.props.type;
                        elementName = "input";
                        break;
                    case "textarea":
                        elementName = "textarea";
                        break;
                }

                props = $.extend(props, this.props.attributes);

                return React.createElement(elementName, props);
            }

        });

        return FormField;

    });
