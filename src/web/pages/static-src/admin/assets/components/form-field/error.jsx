import React from 'react';

var Error = React.createClass({
    getDefaultProps: function () {
        return {
            className: "m-frf-error"
        };
    },

    render: function () {
        return (
            <span className={this.props.className}>
                {this.props.children}
            </span>
        );
    }
});

export default Error;
