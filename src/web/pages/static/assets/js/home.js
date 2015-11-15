"use strict";

requirejs([
        'react',
        'react-dom',
        'router',
        'jsx!components/navigation',
        'jsx!components/user-list',
        'jsx!components/user-editor'
    ],
    function (React,
              ReactDom,
              Router,
              Navigation,
              UserList,
              UserEditor) {

        var empty = function (element) {
            /*
            while (element.childElementCount > 0) {
                element.removeChild(element.childNodes[0]);
            }
            */
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
                var userEditor = React.createElement(UserEditor, {mode: "add"});
                render(userEditor, reactSelector('user-editor'));
            },

            editButtonClicked: function (user) {
                var userEditor = React.createElement(UserEditor, {mode: "edit", user: user});
                render(userEditor, reactSelector('user-editor'));
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
