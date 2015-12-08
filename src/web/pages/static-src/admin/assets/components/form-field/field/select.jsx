import Field from './field';
import React from 'react';

class Select extends Field {
    render() {
        var options = this.props.children.map(function (child) {
            return React.createElement("option", child);
        });
        return React.createElement("select", this.props, options);
    }
}

Select.defaultProps = {
    elementName: "select",
    className: "m-frf-select"
};

export default Select;


export default Select;