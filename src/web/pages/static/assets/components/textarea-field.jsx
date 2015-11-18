"use strict";

define([
        'react'],
    function (React) {

        var TextareaField = React.createClass({

            getInitialState: function () {
                return {
                    error: "",
                    value: ""
                };
            },

            getDefaultProps: function () {
                return {
                    id: "",
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

            _createTextAreaElement () {
                var props = {
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

                return React.createElement('textarea', props);
            },

            render: function () {

                var textarea = this._createTextAreaElement();

                return (
                    <div className={this.props.classNames.container}>
                        <label className={this.props.classNames.label}
                               htmlFor={this.props.id}>{this.props.label}</label>

                        {textarea}

                        { this.state.error
                            ? (<span className={this.props.classNames.error}>{this.state.error.message}</span>)
                            : null }
                    </div>
                );
            }
        });

        return TextareaField;

    });
