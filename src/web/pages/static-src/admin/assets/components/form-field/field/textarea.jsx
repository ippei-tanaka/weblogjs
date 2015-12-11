import React from 'react';


class Textarea extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ""
        };
    }

    componentWillMount() {
        this._props = Object.assign({}, this.props);
        this._props.onChange = this.onValueChanged.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.value
        });
    }

    render() {
        this._props.value = this.state.value;
        return React.createElement("textarea", this._props);
    }

    onValueChanged(e) {
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


Textarea.defaultProps = {
    className: "module-textarea",
    value: "",
    onChange: function () {
    }
};


export default Textarea;