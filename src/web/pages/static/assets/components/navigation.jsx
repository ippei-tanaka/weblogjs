"use strict";

define([
        'react',
        'react-dom',
        'classnames'
    ],
    function (React, ReactDOM, classNames) {

        var listItems = [
            {
                name: 'dashboard',
                icon: 'home',
                label: 'Dashboard'
            },
            {
                name: 'users',
                icon: 'user',
                label: 'Users'
            },
            {
                name: 'categories',
                icon: 'object-group',
                label: 'Categories'
            },
            {
                name: 'posts',
                icon: 'newspaper-o',
                label: 'Posts'
            },
            {
                name: 'logout',
                icon: 'sign-out',
                label: 'Log out'
            }
        ];

        var Navigation = React.createClass({

            getDefaultProps: function () {
                return {
                    hrefs: {
                        logout: "",
                        dashboard: "",
                        categories: "",
                        users: "",
                        posts: ""
                    }
                };
            },

            getInitialState: function () {
                return {
                    mobileMenu: false
                };
            },

            render: function () {
                return (
                    <nav className="module-navigation">
                        <button onFocus={this._onToggleFocused}
                                onClick={this._onToggleClicked}
                                onBlur={this._onToggleBlurred}
                                data-react="navigation-toggle"
                                className="module-button m-btn-clear m-nvg-button m-nvg-toggle">
                            <i className="fa fa-bars m-nvg-icon"></i>
                        </button>
                        <menu className={classNames("m-nvg-menu", {"m-nvg-mobile-menu-show": this.state.mobileMenu})}>
                            {listItems.map(function (item) {
                                return (
                                    <li className="m-nvg-menu-item"
                                        key={item.name}>
                                        <a className="module-button m-btn-clear m-nvg-button"
                                           href={this.props.hrefs[item.name]}
                                           onFocus={this._onLinkFocused}
                                           onClick={this._onLinkClicked}
                                           onBlur={this._onLinkBlurred}
                                            >
                                            <i className={classNames("fa", "m-nvg-icon", "fa-" + item.icon)}></i>
                                            {item.label}
                                        </a>
                                    </li>
                                );
                            }.bind(this))}
                        </menu>
                    </nav>
                );
            },

            _onToggleFocused: function () {
                this._throttleMobileMenuValue(true);
            },

            _onToggleClicked: function (e) {
                e.target.focus();
            },

            _onToggleBlurred: function () {
                this._throttleMobileMenuValue(false);
            },

            _onLinkFocused: function (e) {
                this._throttleMobileMenuValue(true);
            },

            _onLinkBlurred: function () {
                this._throttleMobileMenuValue(false);
            },

            _onLinkClicked: function () {
                this._throttleMobileMenuValue(false);
            },

            _throttleMobileMenuValue: function (value) {
                this._mobileMenuValue = value;

                if (this._mobileMenuTimer) {
                    window.clearTimeout(this._mobileMenuTimer);
                }

                this._mobileMenuTimer = window.setTimeout(function () {
                    this.setState({
                        mobileMenu: this._mobileMenuValue
                    });
                }.bind(this), 10);
            },
            _mobileMenuTimer: null,
            _mobileMenuValue: null

        });

        return Navigation;

    });
