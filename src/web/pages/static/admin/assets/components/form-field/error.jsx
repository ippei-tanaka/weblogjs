"use strict";

define([
        'react'
    ],
    function (React) {

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

        return Error;

    });
