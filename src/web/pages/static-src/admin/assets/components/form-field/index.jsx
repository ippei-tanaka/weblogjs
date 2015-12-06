import React from 'react';
import Field from './field';
import Label from './label';
import Error from './error';

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
        var fieldProps = Object.assign({}, this.props.field, {id: id});
        var labelProps = Object.assign({}, this.props.label, {htmlFor: id});

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

export default FormField;