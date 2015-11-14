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

        var render = function (reactElement, containerName) {
            ReactDom.render(reactElement, document.querySelector("[data-react='" + containerName + "']"));
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



        /*

         UserList.onEditButtonClicked.on(function (user) {
         UserEditor.render("edit", user, document.querySelector("[data-react='user-editor']"));
         });

         UserList.onDeleteButtonClicked.on(function (user) {
         //UserEditor.render("delete", user, document.querySelector("[data-react='user-editor']"));
         });
         */

    });
