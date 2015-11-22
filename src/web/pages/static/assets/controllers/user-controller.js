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
                    showUserEditorWitDeleteMode(user._id);
                }
            }
        );


        var showUserEditorWithAddMode = function () {
            userEditorMounter.props = {
                mode: "add",
                userId: null,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(userEditorMounter)
            };
            userEditorMounter.mount();
        };

        var showUserEditorWithEditMode = function (id) {
            userEditorMounter.props = {
                mode: "edit",
                userId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteEditing.fire();
                }.bind(userEditorMounter)
            };
            userEditorMounter.mount();
        };

        var showUserEditorWitDeleteMode = function (id) {
            userEditorMounter.props = {
                mode: "del",
                userId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteDeleting.fire();
                }.bind(popupMounter)
            };
            popupMounter.children = userEditorMounter.build();
            popupMounter.mount();
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
