"use strict";

define([
        'react',
        'moment',
        'jquery',
        'jsx!components/form-field/datetime',
        'jsx!components/form-field/tag-list'
    ],
    function (React, moment, $, Datetime, TagList) {

        var Field = React.createClass({
            getDefaultProps: function () {
                return {
                    id: "",
                    type: "text",
                    className: "",
                    baseClassName: "m-frf-",
                    value: "",
                    onChange: function () {
                    }
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

                // set classname
                props.className = props.className || props.baseClassName + props.type;
                delete props.baseClassName;

                // set value
                props.value = this.state.value;

                if (props.type === "textarea") {
                    return this._createTextArea(props);
                } else if (props.type === "select") {
                    return this._createSelect(props);
                } else if (props.type === "datetime") {
                    return this._createDateTime(props);
                } else if (props.type === "tag-list") {
                    return this._createTagList(props);
                } else {
                    return this._createInput(props);
                }
            },

            _createTextArea: function (props) {
                props.onChange = this._onChangeElementValue;
                return React.createElement("textarea", props);
            },

            _createSelect: function (props) {
                var options = props.children.map(function (child) {
                    return React.createElement("option", child);
                });

                delete props.children;

                props.onChange = this._onChangeElementValue;

                return React.createElement("select", props, options);
            },

            _createDateTime: function (props) {
                props.onChange = this._onChangeDirectValue;
                return React.createElement(Datetime, props);
            },

            _createTagList: function (props) {
                props.onChange = this._onChangeDirectValue;
                return React.createElement(TagList, props);
            },

            _createInput: function (props) {
                props.onChange = this._onChangeElementValue;
                return React.createElement("input", props);
            },

            _onChangeElementValue: function (e) {
                var value = e.target.value;

                if (this.props.onChange(value) === false) {
                    e.preventDefault();
                    return;
                }

                this.setState({
                    value: value
                });
            },

            _onChangeDirectValue: function (value) {
                this.props.onChange(value);
            }

        });

        return Field;

    });