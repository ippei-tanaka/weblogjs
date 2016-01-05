import React from 'react';

var LocationBar = React.createClass({

    getDefaultProps: function () {
        return {
            locations: [
                {
                    label: "test1",
                    link: true,
                    enabled: true,
                    onClick: function () {}
                }
            ]
        };
    },

    render: function () {
        return this.props.locations.length > 0 ? (
            <nav className="module-location-bar">
                <ul className="m-lcb-list">
                    {this.props.locations.map(function (location, index) {
                        var isLink;

                        location = Object.assign({} ,this._defaultLocation, location);

                        if (!location.enabled) {
                            return null;
                            }

                        isLink = location.link && typeof location.onClick === "function";

                        return (
                        <li key={index}
                            className="m-lcb-list-item">
                            {isLink ? (
                            <a href="#"
                               className="m-lcb-link"
                               onClick={this._onClickLink(location.onClick)}>
                                {location.label}
                            </a>
                                ) : (
                            <span className="m-lcb-label">
                                                {location.label}
                                            </span>
                                )}
                        </li>
                            );
                        }.bind(this))}
                </ul>
            </nav>
        ) : null;
    },

    _defaultLocation: {
        label: "",
        link: true,
        enabled: true,
        onClick: null
    },

    _onClickLink: function (callback) {
        return function (e) {
            e.preventDefault();
            callback.call(null);
        }
    }
});

export default LocationBar;
