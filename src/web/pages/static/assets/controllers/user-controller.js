"use strict";

define([
        'jsx!components/user-list',
        'jsx!components/user-editor',
        'jsx!components/popup',
        'services/react-component-mounter',
        'services/event'
    ],
    function (UserList,
              UserEditor,
              PopUp,
              Mounter,
              Event) {


        var userEditorMounter = new Mounter(
            UserEditor, 'main-content-container');


        var popupMounter = new Mounter(PopUp, 'popup-container');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };


        var userListMounter = new Mounter(
            UserList,
            'main-content-container',
            {
                addButtonClicked: function () {
                    exports.onClickAddButton.fire();
                },

                editButtonClicked: function (user) {
                    exports.onClickEditButton.fire(user);
                },

                deleteButtonClicked: function (user) {
                    userEditorMounter.props = {
                        mode: "del",
                        user: user,
                        onComplete: function () {
                            this.unmount();
                            exports.onCompleteDeleting.fire();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = userEditorMounter.build();
                    popupMounter.mount();
                }
            }
        );


        var showUserEditorWithAddMode = function () {
            userEditorMounter.props = {
                mode: "add",
                user: {},
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(userEditorMounter)
            };
            userEditorMounter.mount();
        };

        var showUserEditorWithEditMode = function (id) {
            UserList.getUser(id).then(function (user) {
                userEditorMounter.props = {
                    mode: "edit",
                    user: user,
                    onComplete: function () {
                        this.unmount();
                        exports.onCompleteEditing.fire();
                    }.bind(userEditorMounter)
                };
                userEditorMounter.mount();
            });
        };

        var exports = {
            showUserList: function () {
                popupMounter.unmount();
                userListMounter.mount();
            },
            onClickAddButton: new Event(),
            onClickEditButton: new Event(),
            onCompleteAdding: new Event(),
            onCompleteEditing: new Event(),
            onCompleteDeleting: new Event(),
            showUserEditorWithAddMode: showUserEditorWithAddMode,
            showUserEditorWithEditMode: showUserEditorWithEditMode
        };

        return exports;
    });
