import React from 'react';
/*
import Datetime from './datetime';
import TagList from './tag-list';
import CheckboxList from './checkbox-list';
import Select from './select';
import Input from './input';
import Textarea from './textarea';
*/
/*
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
*/

class Field extends React.Component {
    render () {
        return React.createElement("input", this.props);
    }
}

Field.defaultProps = {
    fieldType: "",
    initialValue: "",
    onValueChanged: function () {}
};

export default Field;
