"use strict";

define([
        'react',
        'react-dom',
        'event-manager',
        'jquery'],
    function (React,
              ReactDom,
              EventManager,
              $) {

        var url = "/api/v1/users";

        var UserCreator = React.createClass({

            onSubmit: function (e) {
                e.preventDefault();

                var email = this.refs.email.value.trim();
                var password = this.refs.password.value.trim();
                var display_name = this.refs.display_name.value.trim();

                $.ajax({
                    url: url,
                    dataType: 'json',
                    cache: false,
                    method: 'post',
                    data: {
                        email: email,
                        password: password,
                        display_name: display_name
                    }
                })
                    .then(function () {
                        this.setState({
                            errors: {}
                        });

                        this.refs.email.value = "";
                        this.refs.password.value = "";
                        this.refs.display_name.value = "";

                        EventManager.fire('user-created');
                    }.bind(this))

                    .fail(function (xhr) {
                        this.setState({
                            errors: xhr.responseJSON.errors
                        });
                    }.bind(this));

                return;
            },

            getInitialState: function () {
                return {
                    errors: {}
                };
            },

            render: function () {
                return (
                    <form className="module-user-creator" onSubmit={this.onSubmit}>

                        <h2 className="m-usc-title">Create a new user</h2>

                        <div className="m-usc-field-container">
                            <label className="m-usc-label" htmlFor="UserManagerEmailInput">Email address</label>
                            <input type="email" className="m-usc-input" id="UserManagerEmailInput"
                                   placeholder="Email"
                                   ref="email"/>
                            { this.state.errors.email
                                ? (<span className="m-usc-error">{this.state.errors.email.message}</span>)
                                : null }
                        </div>

                        <div className="m-usc-field-container">
                            <label className="m-usc-label" htmlFor="UserManagerPasswordInput">Password</label>
                            <input type="password" className="m-usc-input" id="UserManagerPasswordInput"
                                   placeholder="Password" ref="password"/>
                            { this.state.errors.password
                                ? (<span className="m-usc-error">{this.state.errors.password.message}</span>)
                                : null }
                        </div>

                        <div className="m-usc-field-container">
                            <label className="m-usc-label" htmlFor="UserManagerDisplayNameInput">Display Name</label>
                            <input type="text" className="m-usc-input" id="UserManagerDisplayNameInput"
                                   placeholder="Display Name" ref="display_name"/>
                            { this.state.errors.display_name
                                ? (<span className="m-usc-error">{this.state.errors.display_name.message}</span>)
                                : null }

                        </div>

                        <div className="m-usc-field-container">
                            <button type="submit">Create</button>
                        </div>

                    </form>
                );
            }
        });

        return {
            render: function (container) {
                ReactDom.render(<UserCreator />, container);
            }
        };

    });
