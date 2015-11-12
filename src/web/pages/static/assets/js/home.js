"use strict";

requirejs([
        'jsx!components/user-list',
        'jsx!components/user-editor'
    ],
    function (
        UserList,
        UserEditor
    ) {


        UserList.onAddButtonClicked.on(function () {
            UserEditor.render("add", null, document.querySelector("[data-react='user-editor']"));
        });

        UserList.onEditButtonClicked.on(function (user) {
            UserEditor.render("edit", user, document.querySelector("[data-react='user-editor']"));
        });

        UserList.onDeleteButtonClicked.on(function (user) {
            //UserEditor.render("delete", user, document.querySelector("[data-react='user-editor']"));
        });


        UserList.render(document.querySelector("[data-react='user-list']"));


    });
