"use strict";

define([
        'jsx!components/post-list',
        'jsx!components/post-editor',
        'jsx!components/popup',
        'jsx!components/location-bar',
        'services/react-component-mounter',
        'services/event'
    ],
    function (PostList,
              PostEditor,
              PopUp,
              LocationBar,
              Mounter,
              Event) {


        var postEditorMounter;
        var popupMounter;
        var locationBarMounter;
        var postListMounter;
        var showPostList;
        var showPostEditorWithAddMode;
        var showPostEditorWithEditMode;
        var showPostEditorWithDeleteMode;
        var buildLocations;
        var exports;


        postEditorMounter = new Mounter(
            PostEditor, 'main-content-container');

        popupMounter = new Mounter(PopUp, 'popup-container');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };

        locationBarMounter = new Mounter(LocationBar, 'location-bar-container');

        postListMounter = new Mounter(
            PostList,
            'main-content-container',
            {
                addButtonClicked: function () {
                    exports.onClickAddButton.fire();
                },

                editButtonClicked: function (post) {
                    exports.onClickEditButton.fire(post);
                },

                deleteButtonClicked: function (post) {
                    showPostEditorWithDeleteMode(post._id);
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
                    label: "Post List",
                    link: !!options.hasEditor,
                    onClick: function () {
                        exports.onClickListLocation.fire();
                    }
                },
                {
                    label: "Post Editor",
                    enabled: !!options.hasEditor
                }
            ];

            return ret;
        };

        showPostList = function () {
            popupMounter.unmount();
            postListMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations()
            };
            locationBarMounter.mount();
        };

        showPostEditorWithAddMode = function () {
            postEditorMounter.props = {
                mode: "add",
                postId: null,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(postEditorMounter)
            };
            postEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showPostEditorWithEditMode = function (id) {
            postEditorMounter.props = {
                mode: "edit",
                postId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteEditing.fire();
                }.bind(postEditorMounter)
            };
            postEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showPostEditorWithDeleteMode = function (id) {
            postEditorMounter.props = {
                mode: "del",
                postId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteDeleting.fire();
                }.bind(popupMounter)
            };
            popupMounter.children = postEditorMounter.build();
            popupMounter.mount();
        };

        exports = {
            showPostList: showPostList,
            onClickAddButton: new Event(),
            onClickEditButton: new Event(),
            onCompleteAdding: new Event(),
            onCompleteEditing: new Event(),
            onCompleteDeleting: new Event(),
            onClickListLocation: new Event(),
            showPostEditorWithAddMode: showPostEditorWithAddMode,
            showPostEditorWithEditMode: showPostEditorWithEditMode
        };

        return exports;
    });
