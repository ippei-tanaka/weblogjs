import React from 'react';
import ServerFacade from '../services/server-facade';
import FormField from './form-field';


var successUrl = "/admin/";


var LoginForm = React.createClass({

    onSubmit: function (e) {
        e.preventDefault();

        var email = this.state.email.trim();
        var password = this.state.password.trim();

        ServerFacade.login(email, password)
            .then(function () {
                window.location.replace(successUrl);
            })
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

        /*
        var emailField = React.createElement(FormField, {
            field: {
                type: "email",
                value: this.state.email,
                onChange: function (value) {
                    this.setState({ email: value });
                }.bind(this),
                autoFocus: true,
                placeholder: "Email Address"
            }
        });

        var passwordField = React.createElement(FormField, {
            field: {
                type: "password",
                value: this.state.password,
                onChange: function (value) {
                    this.setState({ password: value });
                }.bind(this),
                placeholder: "Password"
            }
        });
        */

        return <div>Test</div>;
/*
        return (
            <form className="module-login-form" method="post" onSubmit={this.onSubmit}>
                <div className="m-lgf-wrapper">
                    <div className="module-data-editor">
                        <h1 className="m-dte-title">WeblogJS Admin Site</h1>
                        <div className="m-dte-field-container">
                            {emailField}
                        </div>
                        <div className="m-dte-field-container">
                            {passwordField}
                        </div>
                        { this.state.error
                            ? (
                        <div className="m-dte-field-container">
                            <span className="m-lgf-error">The email or password is incorrect.</span>
                        </div>)
                            : null }

                        <div className="m-dte-field-container">
                            <button className="module-button m-btn-plain" type="submit">Sign in</button>
                        </div>
                    </div>
                </div>
            </form>
        );
        */
    }
});


export default LoginForm;
