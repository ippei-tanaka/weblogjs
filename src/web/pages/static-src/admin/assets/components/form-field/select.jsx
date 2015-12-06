"use strict";

define([
        'react',
        'services/extend'
    ],
    function (React, extend) {

        var Select = React.createClass({

            getDefaultProps: function () {
                return {
                    className: "m-frf-select",
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
                this._props = extend({}, this.props);
                this._props.onChange = this._onChange;
                delete this._props.children;
            },

            componentWillReceiveProps: function (newProps) {
                this.setState({
                    value: newProps.value
                });
            },

            render: function () {
                var options = this.props.children.map(function (child) {
                    return React.createElement("option", child);
                });
                this._props.value = this.state.value;
                return React.createElement("select", this._props, options);
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

        return Select;

    });
