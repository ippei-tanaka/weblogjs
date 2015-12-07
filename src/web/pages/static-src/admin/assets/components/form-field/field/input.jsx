import React from 'react';

class Input extends React.Component {

    constructor(props) {
        super(props);

        this.setState({
            value: ""
        });
    }

    componentWillMount() {
        this._props = Object.assign({}, this.props);
        this._props.onChange = this._onChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    render() {
        this._props.value = this.state.value;
        return React.createElement("input", this._props);
    }

    _onChange(e) {
        var value = e.target.value;

        if (this.props.onChange(value) === false) {
            e.preventDefault();
            return;
        }

        this.setState({
            value: value
        });
    }

}

Input.defaultProps = {
    className: "m-frf-text",
    value: "",
    onChange: function () {
    }
};

export default Input;
