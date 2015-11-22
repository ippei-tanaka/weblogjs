"use strict";

define([
        'react',
        'moment',
        'jquery',
        'jsx!components/form-field/field',
        'jsx!components/form-field/label',
        'jsx!components/form-field/error'
    ],
    function (React, moment, $, Field, Label, Error) {

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
                var fieldProps = $.extend(this.props.field, {id: id});
                var labelProps = $.extend(this.props.label, {htmlFor: id});

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

                for (var i = 0; i < length; i++) {
                    id += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                return id;
            }
        });

        return FormField;

    });
