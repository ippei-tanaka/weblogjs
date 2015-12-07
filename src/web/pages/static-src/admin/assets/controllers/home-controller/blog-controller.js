"use strict";

define([
        'jsx!components/blog-list',
        'jsx!components/blog-editor',
        'jsx!components/popup',
        'jsx!components/location-bar',
        'services/react-component-mounter',
        'services/event'
    ],
    function (BlogList,
              BlogEditor,
              PopUp,
              LocationBar,
              Mounter,
              Event) {


        var blogEditorMounter;
        var popupMounter;
        var locationBarMounter;
        var blogListMounter;
        var buildLocations;
        var showBlogList;
        var showBlogEditorWithAddMode;
        var showBlogEditorWithEditMode;
        var showBlogEditorWitDeleteMode;
        var exports;


        blogEditorMounter = new Mounter(
            BlogEditor, 'main-content-container');

        locationBarMounter = new Mounter(LocationBar, 'location-bar-container');

        popupMounter = new Mounter(PopUp, 'popup-container');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };

        blogListMounter = new Mounter(
            BlogList,
            'main-content-container',
            {
                addButtonClicked: function () {
                    exports.onClickAddButton.fire();
                },

                editButtonClicked: function (id) {
                    exports.onClickEditButton.fire(id);
                },

                deleteButtonClicked: function (id) {
                    showBlogEditorWitDeleteMode(id);
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
                    label: "Blog List",
                    link: !!options.hasEditor,
                    onClick: function () {
                        exports.onClickListLocation.fire();
                    }
                },
                {
                    label: "Blog Editor",
                    enabled: !!options.hasEditor
                }
            ];

            return ret;
        };

        showBlogList = function () {
            popupMounter.unmount();
            blogListMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations()
            };
            locationBarMounter.mount();
        };

        showBlogEditorWithAddMode = function () {
            blogEditorMounter.props = {
                mode: "add",
                blogId: null,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(blogEditorMounter)
            };
            blogEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showBlogEditorWithEditMode = function (id) {
            blogEditorMounter.props = {
                mode: "edit",
                blogId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteEditing.fire();
                }.bind(blogEditorMounter)
            };
            blogEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showBlogEditorWitDeleteMode = function (id) {
            blogEditorMounter.props = {
                mode: "del",
                blogId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteDeleting.fire();
                }.bind(popupMounter)
            };
            popupMounter.children = blogEditorMounter.build();
            popupMounter.mount();
        };

        exports = {
            showBlogList:showBlogList,
            onClickAddButton: new Event(),
            onClickEditButton: new Event(),
            onClickListLocation: new Event(),
            onCompleteAdding: new Event(),
            onCompleteEditing: new Event(),
            onCompleteDeleting: new Event(),
            showBlogEditorWithAddMode: showBlogEditorWithAddMode,
            showBlogEditorWithEditMode: showBlogEditorWithEditMode
        };

        return exports;
    });
