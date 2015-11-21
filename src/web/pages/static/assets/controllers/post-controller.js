"use strict";

define([
        'jsx!components/post-list',
        'jsx!components/post-editor',
        'jsx!components/popup',
        'services/react-component-mounter',
        'services/event'
    ],
    function (PostList,
              PostEditor,
              PopUp,
              Mounter,
              Event) {


        var postEditorMounter = new Mounter(PostEditor, 'main-content-container');

        var popupMounter = new Mounter(PopUp, 'popup-container');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };

        var postListMounter = new Mounter(
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
                    postEditorMounter.props = {
                        mode: "del",
                        post: post,
                        onComplete: function () {
                            this.unmount();
                            exports.onCompleteDeleting.fire();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = postEditorMounter.build();
                    popupMounter.mount();
                }
            }
        );

        var showPostEditorWithAddMode = function () {
            postEditorMounter.props = {
                mode: "add",
                post: {},
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(postEditorMounter)
            };
            postEditorMounter.mount();
        };

        var showPostEditorWithEditMode = function (id) {
            PostList.getPost(id).then(function (post) {
                postEditorMounter.props = {
                    mode: "edit",
                    post: post,
                    onComplete: function () {
                        this.unmount();
                        exports.onCompleteEditing.fire();
                    }.bind(postEditorMounter)
                };
                postEditorMounter.mount();
            });
        };

        var exports = {
            showPostList: function () {
                postListMounter.mount();
            },
            onClickAddButton: new Event(),
            onClickEditButton: new Event(),
            onCompleteAdding: new Event(),
            onCompleteEditing: new Event(),
            onCompleteDeleting: new Event(),
            showPostEditorWithAddMode: showPostEditorWithAddMode,
            showPostEditorWithEditMode: showPostEditorWithEditMode
        };

        return exports;
    });
