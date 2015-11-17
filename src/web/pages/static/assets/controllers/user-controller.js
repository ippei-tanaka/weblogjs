"use strict";

define([
        'jsx!components/navigation',
        'jsx!components/user-list',
        'jsx!components/user-editor',
        'jsx!components/popup',
        'services/react-component-mounter'
    ],
    function (Navigation,
              UserList,
              UserEditor,
              PopUp,
              ReactComponentMounter) {


        var userEditorMounter = new ReactComponentMounter(UserEditor);


        var popupMounter = new ReactComponentMounter(PopUp, 'user-editor');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };


        var userListMounter = new ReactComponentMounter(
            UserList,
            'user-list',
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
                userListMounter.mount();
            },

            clean: function () {
                userListMounter.unmount();
            }
        };
    });
