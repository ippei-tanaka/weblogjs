import React from 'react';
import GlobalEvents from '../services/global-events';
import ServerFacade from '../services/server-facade';
import Confirmation from './confirmation';
import FormField from './form-field';


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
                display_name: "",
                privileges: []
            },
            privileges: []
        };
    },

    getDefaultProps: function () {
        return {
            mode: "", // 'add', 'edit' or 'del'
            userId: "",
            onComplete: function () {
            }
        };
    },

    componentWillMount: function () {
        if (this.props.mode === "edit" || this.props.mode === "del") {
            ServerFacade.getUser(this.props.userId).then(function (user) {
                this._setUserState(this.getInitialState().user, user);
            }.bind(this));
        }

        ServerFacade.getPrivileges().then(function (privileges) {
            this.setState({
                privileges: Object.keys(privileges).map(function (key) {
                    return {
                        value: privileges[key],
                        label: key
                    }
                })
            });
        }.bind(this));
    },

    render: function () {
        return this._chooseByMode({
            add: this._renderForm,
            edit: this._renderForm,
            del: this._renderConfirmation
        })();
    },

    _renderForm: function () {

        var emailField = React.createElement(FormField, {
            field: {
                type: "email",
                value: this.state.user.email,
                onChange: function (value) {
                    this._setUserState(this.state.user, {email: value});
                }.bind(this),
                autoFocus: true,
                disabled: this._chooseByMode({
                    add: false,
                    edit: true
                })
            },
            label: {
                children: "Email Address"
            },
            error: {
                children: this.state.errors.email ? this.state.errors.email.message : ""
            }
        });

        var passwordField = React.createElement(FormField, {
            field: {
                type: "password",
                value: this.state.user.password,
                onChange: function (value) {
                    this._setUserState(this.state.user, {password: value});
                }.bind(this)
            },
            label: {
                children: "Password"
            },
            error: {
                children: this.state.errors.password ? this.state.errors.password.message : ""
            }
        });

        passwordField = this._chooseByMode({add: passwordField, edit: null});

        var displayNameField = React.createElement(FormField, {
            field: {
                type: "text",
                value: this.state.user.display_name,
                onChange: function (value) {
                    this._setUserState(this.state.user, {display_name: value});
                }.bind(this)
            },
            label: {
                children: "Display Name"
            },
            error: {
                children: this.state.errors.display_name ? this.state.errors.display_name.message : ""
            }
        });

        var privilegesField = React.createElement(FormField, {
            field: {
                type: "checkbox-list",
                value: this.state.user.privileges,
                onChange: function (value) {
                    this._setUserState(this.state.user, {privileges: value});
                }.bind(this),
                children: this.state.privileges.map(function (privilege) {
                    return {
                        key: privilege.value,
                        name: privilege.value,
                        label: privilege.label
                    }
                })
            },
            label: {
                children: "Privileges"
            },
            error: {
                children: this.state.errors.privileges ? this.state.errors.privileges.message : ""
            }
        });

        var title = this._chooseByMode({add: "Create a New User", edit: "Edit the User"});

        var buttonLabel = this._chooseByMode({add: "Create", edit: "Edit"});

        return (
            <form className="module-data-editor" onSubmit={this._onSubmit}>
                <h2 className="m-dte-title">{title}</h2>
                <div className="m-dte-field-container">
                    {emailField}
                </div>
                <div className="m-dte-field-container">
                    {passwordField}
                </div>
                <div className="m-dte-field-container">
                    {displayNameField}
                </div>
                <div className="m-dte-field-container">
                    {privilegesField}
                </div>
                <div className="m-dte-field-container">
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
            .catch(function (data) {
                this.setState({
                    errors: data.errors
                });
            }.bind(this));
    },

    _onDeleteApproved: function () {
        this._deleteUser().then(function () {
            this.props.onComplete();
        }.bind(this)).catch(function (data) {
            console.error(data);
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

        return ServerFacade.createUser(data)
            .then(function () {
                GlobalEvents.userCreated.fire();
            });
    },

    _updateUser: function () {

        var data = {
            display_name: this.state.user.display_name.trim(),
            privileges: this.state.user.privileges
        };

        return ServerFacade.updateUser(this.props.userId, data)
            .then(function () {
                GlobalEvents.userUpdated.fire();
            });
    },

    _deleteUser: function () {
        return ServerFacade.deleteUser(this.props.userId)
            .then(function () {
                GlobalEvents.userDeleted.fire();
            });
    },

    _setUserState: function (defaultUser, user) {
        this.setState({
            user: Object.assign({}, defaultUser, this._flatten(user))
        });
    },

    _flatten: function (obj) {
        var newObj = {};

        Object.keys(obj).forEach(function (key) {
            if (typeof obj[key] !== 'undefined') {
                newObj[key] = obj[key];
            }
        });

        return newObj;
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

export default UserEditor;