"use strict";

define([
        'react',
        'jquery'],
    function (React,
              $) {

        var InputField = React.createClass({

            // TODO check if it is working.
            propTypes: {
                initialValue: React.PropTypes.string,
                error: React.PropTypes.objectOf(React.PropTypes.string),
                onChange: React.PropTypes.func,
                classNames: React.PropTypes.objectOf(React.PropTypes.string),
                attributes: React.PropTypes.objectOf([React.PropTypes.string, React.PropTypes.boolean]),
                label: React.PropTypes.string
            },

            getInitialState: function () {
                return {
                    error: "",
                    value: ""
                };
            },

            getDefaultProps: function () {
                return {
                    initialValue: "",

                    label: "",

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

                    attributes: {
                        id: "",
                        type: "",
                        disabled: false
                    }
                };
            },

            componentDidMount: function () {
                this.setState({
                    value: this.props.initialValue,
                    error: this.props.error
                });
            },

            componentWillReceiveProps: function (newProps) {
                this.setState({
                    value: newProps.initialValue,
                    error: newProps.error
                });
            },

            _onChange: function (e) {
                var value = e.target.value;

                this.setState({
                    value: value
                });

                this.props.onChange(value);
            },

            render: function () {
                return (
                    <div className={this.props.classNames.container}>
                        <label className={this.props.classNames.label}
                               htmlFor={this.props.attributes.id}>{this.props.label}</label>

                        <input type={this.props.attributes.type}
                               className={this.props.classNames.input}
                               id={this.props.attributes.id}
                               value={this.state.value}
                               onChange={this._onChange}
                               disabled={this.props.attributes.disabled}/>

                        { this.state.error
                            ? (<span className={this.props.classNames.error}>{this.state.error.message}</span>)
                            : null }

                    </div>
                );
            }
        });

        return InputField;

    });
