"use strict";

define([
        'react',
        'services/global-events',
        'jquery',
        'jsx!components/input-field',
        'jsx!components/confirmation'
    ],
    function (React,
              GlobalEvents,
              $,
              InputField,
              Confirmation) {

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

        var inputFactory = function (props) {
            var defaultProps = {
                classNames: {
                    container: "m-ued-field-container",
                    label: "m-ued-label",
                    input: "m-ued-input",
                    error: "m-ued-error"
                }
            };
            return React.createElement(InputField, $.extend(defaultProps, props));
        };

        var UserEditor = React.createClass({

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
                    mode: "", // 'add', 'edit' or 'del'
                    user: {
                        _id: "",
                        email: "",
                        password: "",
                        display_name: ""
                    },
                    onComplete: function () {
                    }
                };
            },

            componentWillMount: function () {
                this._setUserState(this.getInitialState().user, this.props.user);
            },

            render: function () {
                return this._chooseByMode({
                    add: this._renderForm,
                    edit: this._renderForm,
                    del: this._renderConfirmation
                })();
            },

            _renderForm: function () {

                var emailField = inputFactory({
                    id: "UserManagerEmailInput",
                    type: "email",
                    initialValue: this.state.user.email,
                    error: this.state.errors.email,
                    onChange: function (e) {
                        this._setUserState(this.state.user, {email: e.target.value});
                    }.bind(this),
                    attributes: {
                        disabled: this._chooseByMode({add: false, edit: true}),
                        ref: this._chooseByMode({add: this._autoFocus, edit: null})
                    },
                    label: "Email address"
                });

                var passwordField = inputFactory({
                    id: "UserManagerPasswordInput",
                    type: "password",
                    initialValue: this.state.user.password,
                    error: this.state.errors.password,
                    onChange: function (e) {
                        this._setUserState(this.state.user, {password: e.target.value});
                    }.bind(this),
                    label: "Password"
                });

                passwordField = this._chooseByMode({add: passwordField, edit: null});

                var displayNameField = inputFactory({
                    id: "UserManagerDisplayNameInput",
                    type: "text",
                    initialValue: this.state.user.display_name,
                    error: this.state.errors.display_name,
                    onChange: function (e) {
                        this._setUserState(this.state.user, {display_name: e.target.value});
                    }.bind(this),
                    attributes: {
                        ref: this._chooseByMode({add: null, edit: this._autoFocus})
                    },
                    label: "Display Name"
                });

                var title = this._chooseByMode({add: "Create a new user", edit: "Edit the user"});

                var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

                return (
                    <form className="module-user-editor" onSubmit={this._onSubmit}>
                        <h2 className="m-ued-title">{title}</h2>
                        {emailField}
                        {passwordField}
                        {displayNameField}
                        <div className="m-ued-field-container">
                            <button className="module-button"
                                    type="submit">{buttonLabel}</button>
                        </div>
                    </form>
                );
            },

            _renderConfirmation: function () {
                return (
                    <Confirmation
                        mode="choose"
                        onApproved={this._onDeleteApproved}
                        onCanceled={this._onDeleteCanceled}
                        >
                        Do you want to delete "{this.state.user.display_name}"?
                    </Confirmation>
                );
            },

            _onSubmit: function (e) {
                e.preventDefault();

                var ajaxFunc = this._chooseByMode({
                    add: this._createUser,
                    edit: this._updateUser
                });

                ajaxFunc()
                    .then(function () {
                        this.setState(this.getInitialState());
                        this.props.onComplete();
                    }.bind(this))
                    .fail(function (xhr) {
                        this.setState({
                            errors: xhr.responseJSON.errors
                        });
                    }.bind(this));
            },

            _onDeleteApproved: function () {
                this._deleteUser().then(function () {
                    this.props.onComplete();
                }.bind(this)).fail(function (xhr) {
                    console.error(xhr.responseJSON.errors);
                });
            },

            _onDeleteCanceled: function () {
                this.props.onComplete();
            },

            _createUser: function () {

                var data = {
                    email: this.state.user.email.trim(),
                    password: this.state.user.password.trim(),
                    display_name: this.state.user.display_name.trim()
                };

                return this._sendHttpRequest(url, 'post', data)
                    .then(function () {
                        GlobalEvents.userCreated.fire();
                    });
            },

            _autoFocus: function (input) {
                if (input != null) {
                    input.focus();
                }
            },

            _updateUser: function () {

                var ajaxUrl = url + '/' + this.props.user._id;

                var data = {
                    display_name: this.state.user.display_name.trim()
                };

                return this._sendHttpRequest(ajaxUrl, 'put', data)
                    .then(function () {
                        GlobalEvents.userUpdated.fire();
                    });
            },

            _deleteUser: function () {
                var ajaxUrl = url + '/' + this.props.user._id;

                return this._sendHttpRequest(ajaxUrl, 'delete')
                    .then(function () {
                        GlobalEvents.userDeleted.fire();
                    });
            },


            _sendHttpRequest: function (url, method, data) {
                var options = {
                    url: url,
                    dataType: 'json',
                    cache: false,
                    method: method
                };

                if (data) {
                    options.data = data;
                }

                return $.ajax(options);
            },

            _setUserState: function (defaultUser, user) {
                this.setState({
                    user: $.extend(defaultUser, flatten(user))
                });
            },

            _chooseByMode: function (options) {
                if (this.props.mode === 'add') {
                    return options.add;
                } else if (this.props.mode === 'edit') {
                    return options.edit;
                } else if (this.props.mode === 'del') {
                    return options.del;
                } else {
                    throw new Error('Mode should have been selected.');
                }
            }
        });

        return UserEditor;

    });
