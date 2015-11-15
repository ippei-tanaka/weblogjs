"use strict";

define([
        'react',
        'jquery'],
    function (React,
              $) {

        var InputField = React.createClass({

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
                        input: "",
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

            _onChange: function (e) {
                if (this.props.onChange.call(null, e) === false) {
                    e.preventDefault();
                    return;
                }

                this.setState({
                    value: e.target.value
                });
            },

            _createInputElement () {
                var props = {
                    type: this.props.type,
                    className: this.props.classNames.input,
                    id: this.props.id,
                    value: this.state.value,
                    onChange: this._onChange
                };

                if (typeof this.props.attributes === "object"
                    && this.props.attributes) {
                    Object.keys(this.props.attributes).forEach(function (key) {
                        props[key] = this.props.attributes[key];
                    }.bind(this));
                }

                return React.createElement('input', props);
            },

            render: function () {

                var input = this._createInputElement();

                return (
                    <div className={this.props.classNames.container}>
                        <label className={this.props.classNames.label}
                               htmlFor={this.props.id}>{this.props.label}</label>

                        {input}

                        { this.state.error
                            ? (<span className={this.props.classNames.error}>{this.state.error.message}</span>)
                            : null }
                    </div>
                );
            }
        });

        return InputField;

    });
