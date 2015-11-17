"use strict";

define([
        'react'
    ],
    function (React) {

        var Navigation = React.createClass({

            getDefaultProps: function () {
                return {
                    hrefs: {
                        logout: "/admin/logout",
                        dashboard: "#/",
                        users: "#/users",
                        posts: "#/posts"
                    }
                };
            },

            getInitialState: function () {
                return {
                    error: false
                };
            },

            render: function () {
                var hrefs = this.props.hrefs;

                return (
                    <nav className="module-navigation">
                        <ul className="m-nvg-list">
                            <li className="m-nvg-list-item"><a className="m-nvg-link" href={hrefs.logout}>Log out</a></li>
                            <li className="m-nvg-list-item"><a className="m-nvg-link" href={hrefs.dashboard}>Dashboard</a></li>
                            <li className="m-nvg-list-item"><a className="m-nvg-link" href={hrefs.users}>Users</a></li>
                            <li className="m-nvg-list-item"><a className="m-nvg-link" href={hrefs.categories}>Categories</a></li>
                            <li className="m-nvg-list-item"><a className="m-nvg-link" href={hrefs.posts}>Posts</a></li>
                        </ul>
                    </nav>
                );
            }
        });

        return Navigation;

    });
