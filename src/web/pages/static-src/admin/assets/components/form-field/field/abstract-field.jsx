import React from 'react';

class AbstractField extends React.Component {

    render() {
        return React.createElement(this.props.elementName, this.buildElementProps());
    }

    buildElementProps() {
        return {
            id: this.props.id,
            type: this.props.type,
            [this.keyNameForValue]: this.props.value,
            className: this.props.className,
            onChange: this.wrapOnChange.call(this, this.props.onChange)
        };
    }

    wrapOnChange(onChange) {
        return (e) => {
            onChange(this.getFieldValue(e));
        };
    }

    getFieldValue (event) {
        return event.target[this.keyNameForValue];
    }

    get keyNameForValue () {
        return "value";
    }

}

AbstractField.defaultProps = {
    elementName: "",
    type: "",
    id: "",
    className: "",
    value: null,
    onChange: function () {
    }
};

export default AbstractField;
