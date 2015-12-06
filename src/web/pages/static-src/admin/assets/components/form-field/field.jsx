"use strict";

define([
        'react',
        'jsx!components/form-field/datetime',
        'jsx!components/form-field/tag-list',
        'jsx!components/form-field/checkbox-list',
        'jsx!components/form-field/select',
        'jsx!components/form-field/input',
        'jsx!components/form-field/textarea'
    ],
    function (React,
              Datetime,
              TagList,
              CheckboxList,
              Select,
              Input,
              Textarea) {

        var elements = {
            "datetime": Datetime,
            "tag-list": TagList,
            "checkbox-list": CheckboxList,
            "select": Select,
            "email": Input,
            "text": Input,
            "password": Input,
            "textarea": Textarea
        };

        var Field = React.createClass({

            getDefaultProps: function () {
                return {
                    type: ""
                };
            },

            render: function () {
                return React.createElement(elements[this.props.type], this.props);
            }
        });

        return Field;

    });
