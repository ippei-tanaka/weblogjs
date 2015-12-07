import React from 'react';


var Textarea = React.createClass({

    getDefaultProps: function () {
        return {
            className: "m-frf-textarea",
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
    },

    componentWillReceiveProps: function (newProps) {
        this.setState({
            value: newProps.value
        });
    },

    render: function () {
        this._props.value = this.state.value;
        return React.createElement("textarea", this._props);
    },

    _onChange: function (e) {
        var value = e.target.value;

        if (this.props.onChange(value) === false) {
            e.preventDefault();
            return;
        }

        this.setState({
            value: value
        });
    }
});


export default Textarea;