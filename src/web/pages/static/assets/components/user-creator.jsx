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
                    .then(function (data) {
                        console.log(data);
                        EventManager.fire('user-created');
                    }.bind(this))
                    .fail(function (xhr, status, err) {
                        console.log(xhr);
                        console.error(url, status, err.toString());
                    }.bind(this));

                return;
            },

            render: function () {
                return (
                    <form className="module-user-creator" onSubmit={this.onSubmit}>
                        <label className="m-usc-label" htmlFor="UserManagerEmailInput">Email address</label>
                        <input type="email" className="m-usc-input" id="UserManagerEmailInput"
                               placeholder="Email"
                               ref="email"/>
                        <label className="m-usc-label" htmlFor="UserManagerPasswordInput">Password</label>
                        <input type="password" className="m-usc-input" id="UserManagerPasswordInput"
                               placeholder="Password" ref="password"/>
                        <label className="m-usc-label" htmlFor="UserManagerDisplayNameInput">Display Name</label>
                        <input type="text" className="m-usc-input" id="UserManagerDisplayNameInput"
                               placeholder="Display Name" ref="display_name"/>
                        <button type="submit">Create</button>
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
