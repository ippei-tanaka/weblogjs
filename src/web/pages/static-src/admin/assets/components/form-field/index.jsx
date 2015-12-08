import React from 'react';
import Field from './field';

var FormField = React.createClass({

    getDefaultProps: function () {
        return {
            containerClassName: "module-form-field",
            label: "",
            field: {},
            error: ""
        };
    },

    render: function () {
        var id = this.props.field.id || this._generateId();
        var fieldProps = Object.assign({}, this.props.field, {id: id});

        var field = React.createElement(Field, fieldProps);

        return (
            <div className={this.props.containerClassName}>
                { field }
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