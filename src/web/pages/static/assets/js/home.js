"use strict";

requirejs([
        'react',
        'react-dom',
        'jsx!components/user-list',
        'jsx!components/user-editor'
    ],
    function (React,
              ReactDom,
              UserList,
              UserEditor) {

        var factory = function (type) {
            return React.createElement.bind(null, type);
        };

        var empty = function () {
            while (this.childElementCount > 0) {
                this.removeChild(this.childNodes[0]);
            }
        };

        var render = function (reactElement, containerName) {
            var container = document.querySelector("[data-react='" + containerName + "']");

            empty.call(container);

            ReactDom.render(reactElement, container);
        };

        var userEditorFactory = factory(UserEditor);

        var userListFactory = factory(UserList);

        var userList = userListFactory({

            addButtonClicked: function () {
                render(userEditorFactory({mode: "add"}), 'user-editor');
            },

            editButtonClicked: function (user) {
                render(userEditorFactory({mode: "edit", user: user}), 'user-editor');
            },

            deleteButtonClicked: function () {

            }
        });

        render(userList, 'user-list');

    });
