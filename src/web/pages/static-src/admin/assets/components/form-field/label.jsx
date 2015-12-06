import React from 'react';

var Label = React.createClass({
    getDefaultProps: function () {
        return {
            id: "",
            className: "m-frf-label"
        };
    },

    render: function () {
        return (
            <label className={this.props.className}
                   htmlFor={this.props.htmlFor}>
                {this.props.children}
            </label>
        );
    }
});

export default Label;
