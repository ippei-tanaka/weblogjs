"use strict";

define([
        'jsx!components/post-list',
        'jsx!components/post-editor',
        'jsx!components/popup',
        'services/react-component-mounter'
    ],
    function (PostList,
              PostEditor,
              PopUp,
              Mounter) {


        var postEditorMounter = new Mounter(PostEditor);


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
                    postEditorMounter.props = {
                        mode: "add",
                        post: {},
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = postEditorMounter.build();
                    popupMounter.mount();
                },

                editButtonClicked: function (post) {
                    postEditorMounter.props = {
                        mode: "edit",
                        post: post,
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = postEditorMounter.build();
                    popupMounter.mount();
                },

                deleteButtonClicked: function (post) {
                    postEditorMounter.props = {
                        mode: "del",
                        post: post,
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = postEditorMounter.build();
                    popupMounter.mount();
                }
            }
        );


        return {
            showPostList: function () {
                popupMounter.unmount();
                postListMounter.mount();
            }
        };
    });
