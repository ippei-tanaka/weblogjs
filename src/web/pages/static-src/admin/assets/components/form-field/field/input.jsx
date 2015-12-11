import React from 'react';


class Input extends React.Component {

    render() {
        return <input id={this.props.id}
                      type={this.props.type}
                      value={this.props.value}
                      className={this.props.className}
                      onChange={this.wrapOnChange.call(this, this.props.onChange)}/>;
    }

    wrapOnChange(onChange) {
        return (e) => {
            onChange(e.target.value);
        };
    }

}

Input.defaultProps = {
    id: "",
    type: "text",
    className: "module-field-text",
    value: null,
    onChange: function () {
    }
};


export default Input;
