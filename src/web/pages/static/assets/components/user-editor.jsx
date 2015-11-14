"use strict";

define([
        'react',
        'global-events',
        'jquery',
        'jsx!components/input-field'],
    function (React,
              GlobalEvents,
              $,
              InputField) {

        var url = "/api/v1/users";

        var flatten = function (obj) {
            var newObj = {};

            Object.keys(obj).forEach(function (key) {
                if (typeof obj[key] !== 'undefined') {
                    newObj[key] = obj[key];
                }
            });

            return newObj;
        };

        var UserEditor = React.createClass({

            _onSubmit: function (e) {
                e.preventDefault();

                var data = this._returnByMode(
                    {
                        email: this.state.user.email.trim(),
                        password: this.state.user.password.trim(),
                        display_name: this.state.user.display_name.trim()
                    },
                    {
                        display_name: this.state.user.display_name.trim()
                    });

                $.ajax({
                    url: this._returnByMode(url, url + '/' + this.props.user._id),
                    dataType: 'json',
                    cache: false,
                    method: this._returnByMode('post', 'put'),
                    data: data
                })
                    .then(function () {
                        this.setState(this.getInitialState());
                        GlobalEvents.userCreated.fire();
                    }.bind(this))

                    .fail(function (xhr) {
                        this.setState({
                            errors: xhr.responseJSON.errors
                        });
                    }.bind(this));
            },

            getInitialState: function () {
                return {
                    errors: {
                        email: undefined,
                        password: undefined,
                        display_name: undefined
                    },
                    user: {
                        email: "",
                        password: "",
                        display_name: ""
                    }
                };
            },

            getDefaultProps: function () {
                return {
                    mode: "", // 'add' or 'edit'
                    user: {
                        _id: "",
                        email: "",
                        password: "",
                        display_name: ""
                    }
                };
            },

            componentDidMount: function () {
                this._setUserState(this.getInitialState().user, this.props.user);
            },

            componentWillReceiveProps: function (newProps) {
                this._setUserState(this.getInitialState().user, newProps.user);
            },

            _setUserState: function (defaultUser, user) {
                this.setState({
                    user: $.extend(defaultUser, flatten(user))
                });
            },

            _returnByMode: function (forAddMode, forEditMode) {
                return this.props.mode === 'add' ? forAddMode : forEditMode;
            },

            render: function () {

                var factory = function (props) {
                    var defaultProps = {
                        classNames: {
                            container: "m-usc-field-container",
                            label: "m-usc-label",
                            input: "m-usc-input",
                            error: "m-usc-error"
                        }
                    };
                    return React.createElement(InputField, $.extend(defaultProps, props));
                };

                var emailField = factory({
                    error: this.state.errors.email,
                    initialValue: this.state.user.email,
                    onChange: function (value) {
                        this._setUserState(this.state.user, {email: value});
                    }.bind(this),
                    attributes: {
                        id: "UserManagerEmailInput",
                        type: "email",
                        disabled: this._returnByMode(false, true)
                    },
                    label: "Email address"
                });

                var passwordField = factory({
                    error: this.state.errors.password,
                    initialValue: this.state.user.password,
                    onChange: function (value) {
                        this._setUserState(this.state.user, {password: value});
                    }.bind(this),
                    attributes: {
                        id: "UserManagerPasswordInput",
                        type: "password"
                    },
                    label: "Password"
                });

                var displayNameField = factory({
                    error: this.state.errors.display_name,
                    initialValue: this.state.user.display_name,
                    onChange: function (value) {
                        this._setUserState(this.state.user, {display_name: value});
                    }.bind(this),
                    attributes: {
                        id: "UserManagerDisplayNameInput",
                        type: "text"
                    },
                    label: "Display Name"
                });

                return (
                    <form className="module-user-creator" onSubmit={this._onSubmit}>

                        <h2 className="m-usc-title">Create a new user</h2>

                        {emailField}

                        {this._returnByMode(passwordField, null)}

                        {displayNameField}

                        <div className="m-usc-field-container">
                            <button type="submit">{this._returnByMode("Create", "Edit")}</button>
                        </div>

                    </form>
                );
            }
        });

        return UserEditor;

    });
