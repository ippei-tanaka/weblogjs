import React from 'react';

class Checkbox extends React.Component {

    render() {
        return <label>
            <input
                id={this.props.id}
                type="checkbox"
                name={this.props.name}
                checked={this.props.value}
                className={this.props.className}
                onChange={this.props.onChange}
            />
            <span>
                {this.props.label}
            </span>
        </label>
    }

}

Checkbox.defaultProps = {
    id: "",
    name: "",
    value: false,
    className: "module-checkbox",
    onChange: function () {
    }
};

export default Checkbox;
