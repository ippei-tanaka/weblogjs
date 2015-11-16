"use strict";

define([
        'react',
        'jquery',
        'jsx!components/input-field'],
    function (React,
              $,
              InputField) {

        var loginUrl = "/admin/login";
        var successUrl = "/admin/";

        var LoginForm = React.createClass({

            onSubmit: function (e) {
                e.preventDefault();

                var email = this.state.email.trim();
                var password = this.state.password.trim();

                $.ajax({
                    url: loginUrl,
                    dataType: 'json',
                    cache: false,
                    method: 'post',
                    data: {
                        email: email,
                        password: password
                    }
                })
                    .then(function () {
                        window.location.replace(successUrl);
                    }.bind(this))

                    .fail(function () {
                        this.setState({
                            error: true
                        });
                    }.bind(this));
            },

            getInitialState: function () {
                return {
                    error: false,
                    email: "",
                    password: ""
                };
            },

            render: function () {

                var emailField = React.createElement(InputField, {
                    id: "LoginFormInputEmail",
                    type: "email",
                    label: "Email",
                    classNames: {
                        container: "m-lgf-field-container",
                        label: "m-lgf-label",
                        input: "m-lgf-input"
                    },
                    attributes: {
                        required: true,
                        autofocus: true,
                        placeholder: "Email"
                    },
                    onChange: function (e) {
                        this.setState({
                            email: e.target.value
                        });
                    }.bind(this)
                });

                var passwordField = React.createElement(InputField, {
                    id: "LoginFormInputPassword",
                    type: "password",
                    label: "Password",
                    classNames: {
                        container: "m-lgf-field-container",
                        label: "m-lgf-label",
                        input: "m-lgf-input"
                    },
                    attributes: {
                        required: true,
                        placeholder: "Password"
                    },
                    onChange: function (e) {
                        this.setState({
                            password: e.target.value
                        });
                    }.bind(this)
                });

                return (
                    <form className="module-login-form" method="post" onSubmit={this.onSubmit}>
                        <div className="m-lgf-wrapper">
                            <h1 className="m-lgf-title">WeblogJS Admin Site</h1>

                            {emailField}

                            {passwordField}

                            { this.state.error
                                ? (
                                <div className="m-lgf-error-container">
                                    <span className="m-lgf-error">The email or password is incorrect.</span>
                                </div>)
                                : null }

                            <div className="m-lgf-field-container">
                                <button className="module-button" type="submit">Sign in</button>
                            </div>
                        </div>
                    </form>
                );
            }
        });

        return LoginForm;

    });
