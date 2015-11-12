"use strict";

define([
        'react',
        'react-dom',
        'global-events',
        'jquery'],
    function (React,
              ReactDom,
              GlobalEvents,
              $) {

        var url = "/api/v1/users";

        var UserEditor = React.createClass({

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
                    errors: {}
                };
            },

            componentDidMount: function () {
                if (this.props.user) {
                    this.refs.email.value = this.props.user.email;
                    this.refs.password.value = this.props.user.password;
                    this.refs.display_name.value = this.props.user.display_name;
                }
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
                            <button type="submit">{ this.props.mode === 'add' ? 'Create' : 'Edit' }</button>
                        </div>

                    </form>
                );
            }
        });

        return {
            render: function (mode, user, container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
                ReactDom.render(<UserEditor mode={mode} user={user} />, container);
            }
        };

    });
