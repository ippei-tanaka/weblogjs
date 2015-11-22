"use strict";

define([
        'jsx!components/user-list',
        'jsx!components/user-editor',
        'jsx!components/popup',
        'jsx!components/location-bar',
        'services/react-component-mounter',
        'services/event'
    ],
    function (UserList,
              UserEditor,
              PopUp,
              LocationBar,
              Mounter,
              Event) {


        var userEditorMounter;
        var popupMounter;
        var locationBarMounter;
        var userListMounter;
        var buildLocations;
        var showUserList;
        var showUserEditorWithAddMode;
        var showUserEditorWithEditMode;
        var showUserEditorWitDeleteMode;
        var exports;


        userEditorMounter = new Mounter(
            UserEditor, 'main-content-container');

        locationBarMounter = new Mounter(LocationBar, 'location-bar-container');

        popupMounter = new Mounter(PopUp, 'popup-container');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };

        userListMounter = new Mounter(
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

        buildLocations = function (options) {
            var ret;

            options = options || {};

            ret = [
                {
                    label: "Home"
                },
                {
                    label: "User List",
                    link: !!options.hasEditor,
                    onClick: function () {
                        exports.onClickListLocation.fire();
                    }
                },
                {
                    label: "User Editor",
                    enabled: !!options.hasEditor
                }
            ];

            return ret;
        };

        showUserList = function () {
            popupMounter.unmount();
            userListMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations()
            };
            locationBarMounter.mount();
        };

        showUserEditorWithAddMode = function () {
            userEditorMounter.props = {
                mode: "add",
                userId: null,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(userEditorMounter)
            };
            userEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showUserEditorWithEditMode = function (id) {
            userEditorMounter.props = {
                mode: "edit",
                userId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteEditing.fire();
                }.bind(userEditorMounter)
            };
            userEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showUserEditorWitDeleteMode = function (id) {
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

        exports = {
            showUserList:showUserList,
            onClickAddButton: new Event(),
            onClickEditButton: new Event(),
            onClickListLocation: new Event(),
            onCompleteAdding: new Event(),
            onCompleteEditing: new Event(),
            onCompleteDeleting: new Event(),
            showUserEditorWithAddMode: showUserEditorWithAddMode,
            showUserEditorWithEditMode: showUserEditorWithEditMode
        };

        return exports;
    });
