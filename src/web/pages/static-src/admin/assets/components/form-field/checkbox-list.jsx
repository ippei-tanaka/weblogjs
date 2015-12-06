import React from 'react';
import ReactDom from 'react-dom';


var Select = React.createClass({

    getDefaultProps: function () {
        return {
            className: "m-frf-checkbox-list",
            value: "",
            onChange: function () {}
        };
    },

    getInitialState: function () {
        return {
            value: ""
        };
    },

    componentWillMount: function () {
        this._props = Object.assign({}, this.props);
        this._props.onChange = this._onChange;
        delete this._props.children;
    },

    componentWillReceiveProps: function (newProps) {
        this.setState({
            value: newProps.value
        });
    },

    render: function () {
        var options = this.props.children.map(function (childProps) {
            var checked = this.state.value.indexOf(childProps.name) !== -1;
            return (
                <label key={childProps.key}>
                    <input
                        type="checkbox"
                        name={childProps.name}
                        onChange={this._onChange}
                        checked={checked} />
                    <span>{childProps.label.toLowerCase()}</span>
                </label>
            );
        }.bind(this));
        return <div>{options}</div>
    },

    _onChange: function () {
        var inputs = ReactDom.findDOMNode(this).querySelectorAll("input");
        var input, value = [];

        for (var i = 0; i < inputs.length; i++) {
            input = inputs[i];
            if (input.checked) {
                value.push(input.name);
            }
        }

        if (this.props.onChange(value) === false) {
            return;
        }

        this.setState({
            value: value
        });
    }
});

export default Select;
