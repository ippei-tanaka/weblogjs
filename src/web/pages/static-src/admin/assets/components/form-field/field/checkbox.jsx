import React from 'react';


class Checkbox extends React.Component {

    render() {
        return <label>
            <input
                id={this.props.id}
                type="checkbox"
                name={this.props.name}
                checked={this.props.value}
                autoFocus={this.props.autoFocus}
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
    id: null,
    name: null,
    value: false,
    className: "module-checkbox",
    autoFocus: false,
    onChange: function () {
    }
};

export default Checkbox;
