"use strict";

define([
        'react',
        'react-dom',
        'jquery'],
    function (React,
              ReactDom,
              $) {

        var loginUrl = "/admin/login";
        var successUrl = "/admin/";

        var LoginForm = React.createClass({

            onSubmit: function (e) {
                e.preventDefault();

                var email = this.refs.email.value.trim();
                var password = this.refs.password.value.trim();

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
                    error: false
                };
            },

            render: function () {
                return (
                    <form className="module-login-form" method="post" onSubmit={this.onSubmit}>
                        <div className="m-lgf-wrapper">
                            <h1 className="m-lgf-title">WeblogJS Admin Site</h1>

                            <div className="m-lgf-field-container">
                                <label for="inputEmail3" className="m-lgf-label">Email</label>
                                <input type="email" className="m-lgf-input" id="inputEmail" placeholder="Email"
                                       name="email" ref="email" required
                                       autofocus/>
                            </div>

                            <div className="m-lgf-field-container">
                                <label for="inputPassword3" className="m-lgf-label">Password</label>
                                <input type="password" className="m-lgf-input" id="inputPassword"
                                       placeholder="Password" name="password" ref="password"
                                       required/>
                            </div>

                            { this.state.error
                                ? (
                                <div className="m-lgf-error-container">
                                    <span className="m-lgf-error">The email or password is incorrect.</span>
                                </div>)
                                : null }

                            <div className="m-lgf-field-container">
                                <button type="submit">Sign in</button>
                            </div>
                        </div>
                    </form>
                );
            }
        });

        return {
            render: function (container) {
                ReactDom.render(<LoginForm />, container);
            }
        };

    });
