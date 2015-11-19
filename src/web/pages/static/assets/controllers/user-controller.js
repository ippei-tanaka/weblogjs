"use strict";

define([
        'jsx!components/user-list',
        'jsx!components/user-editor',
        'jsx!components/popup',
        'services/react-component-mounter'
    ],
    function (UserList,
              UserEditor,
              PopUp,
              Mounter) {


        var userEditorMounter = new Mounter(UserEditor);


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
                    userEditorMounter.props = {
                        mode: "add",
                        user: {},
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = userEditorMounter.build();
                    popupMounter.mount();
                },

                editButtonClicked: function (user) {
                    userEditorMounter.props = {
                        mode: "edit",
                        user: user,
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = userEditorMounter.build();
                    popupMounter.mount();
                },

                deleteButtonClicked: function (user) {
                    userEditorMounter.props = {
                        mode: "del",
                        user: user,
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = userEditorMounter.build();
                    popupMounter.mount();
                }
            }
        );


        return {
            showUserList: function () {
                popupMounter.unmount();
                userListMounter.mount();
            }
        };
    });
