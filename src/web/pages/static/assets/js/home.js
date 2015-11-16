"use strict";

requirejs([
        'react',
        'react-dom',
        'router',
        'jsx!components/navigation',
        'jsx!components/user-list',
        'jsx!components/user-editor',
        'jsx!components/popup'
    ],
    function (React,
              ReactDom,
              Router,
              Navigation,
              UserList,
              UserEditor,
              PopUp) {

        var empty = function (element) {
            ReactDom.unmountComponentAtNode(element);
        };

        var reactSelector = function (name) {
            return document.querySelector("[data-react='" + name + "']");
        };

        var render = function (reactElement, container) {
            empty(container);
            ReactDom.render(reactElement, container);
        };

        var userList = React.createElement(UserList, {

            addButtonClicked: function () {
                var container = reactSelector('user-editor');

                var userEditor = React.createElement(
                    UserEditor,
                    {
                        mode: "add",
                        onComplete: function () {
                            empty(container);
                        }
                    }
                );

                var popup = React.createElement(
                    PopUp,
                    {
                        onClosed: function () {
                            empty(container);
                        },
                        content: userEditor
                    }
                );

                render(popup, container);
            },

            editButtonClicked: function (user) {
                var container = reactSelector('user-editor');

                var userEditor = React.createElement(
                    UserEditor,
                    {
                        mode: "edit",
                        user: user,
                        onComplete: function () {
                            empty(container);
                        }
                    }
                );

                var popup = React.createElement(
                    PopUp,
                    {
                        onClosed: function () {
                            empty(container);
                        },
                        content: userEditor
                    }
                );

                render(popup, container);
            },

            deleteButtonClicked: function () {

            }
        });

        var navigation = React.createElement(Navigation, {
            hrefs: {
                logout: "/admin/logout",
                dashboard: "#/",
                users: "#/users",
                posts: "#/posts"
            }
        });

        render(navigation, reactSelector('navigation'));

        Router.setDefaultRouteCallback(function () {
            Router.changeHash("/");
        });

        Router.addRoute("/", function () {
            empty(reactSelector('user-list'));
            empty(reactSelector('user-editor'));
        });

        Router.addRoute("/users", function () {
            render(userList, reactSelector('user-list'));
        });

        Router.listen(true);
    });
