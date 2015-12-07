import React from 'react';

class Field extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ""
        };
    }

    componentWillMount() {
        this._props = Object.assign({}, this.props);
        this._props.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    render() {
        this._props.value = this.state.value;
        return React.createElement(this._props.elementName, this._props);
    }

    onChange(e) {
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

Field.defaultProps = {
    elementName: "input",
    className: "m-frf-text",
    value: "",
    onChange: function () {}
};

export default Field;
