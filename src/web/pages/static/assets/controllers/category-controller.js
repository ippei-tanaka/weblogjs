"use strict";

define([
        'jsx!components/category-list',
        'jsx!components/category-editor',
        'jsx!components/popup',
        'jsx!components/location-bar',
        'services/react-component-mounter',
        'services/event'
    ],
    function (CategoryList,
              CategoryEditor,
              PopUp,
              LocationBar,
              Mounter,
              Event) {


        var categoryEditorMounter;
        var popupMounter;
        var locationBarMounter;
        var categoryListMounter;
        var showCategoryList;
        var showCategoryEditorWithAddMode;
        var showCategoryEditorWithEditMode;
        var showCategoryEditorWithDeleteMode;
        var buildLocations;
        var exports;


        categoryEditorMounter = new Mounter(
            CategoryEditor, 'main-content-container');

        popupMounter = new Mounter(PopUp, 'popup-container');

        locationBarMounter = new Mounter(LocationBar, 'location-bar-container');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };

        categoryListMounter = new Mounter(
            CategoryList,
            'main-content-container',
            {
                addButtonClicked: function () {
                    exports.onClickAddButton.fire();
                },

                editButtonClicked: function (category) {
                    exports.onClickEditButton.fire(category);
                },

                deleteButtonClicked: function (category) {
                    showCategoryEditorWithDeleteMode(category._id);
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
                    label: "Category List",
                    link: !!options.hasEditor,
                    onClick: function () {
                        exports.onClickListLocation.fire();
                    }
                },
                {
                    label: "Category Editor",
                    enabled: !!options.hasEditor
                }
            ];

            return ret;
        };

        showCategoryList = function () {
            popupMounter.unmount();
            categoryListMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations()
            };
            locationBarMounter.mount();
        };

        showCategoryEditorWithAddMode = function () {
            categoryEditorMounter.props = {
                mode: "add",
                categoryId: null,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(categoryEditorMounter)
            };
            categoryEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showCategoryEditorWithEditMode = function (id) {
            categoryEditorMounter.props = {
                mode: "edit",
                categoryId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteEditing.fire();
                }.bind(categoryEditorMounter)
            };
            categoryEditorMounter.mount();

            locationBarMounter.props = {
                locations: buildLocations({hasEditor: true})
            };
            locationBarMounter.mount();
        };

        showCategoryEditorWithDeleteMode = function (id) {
            categoryEditorMounter.props = {
                mode: "del",
                categoryId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteDeleting.fire();
                }.bind(popupMounter)
            };
            popupMounter.children = categoryEditorMounter.build();
            popupMounter.mount();
        };

        exports = {
            showCategoryList: showCategoryList,
            onClickAddButton: new Event(),
            onClickEditButton: new Event(),
            onClickListLocation: new Event(),
            onCompleteAdding: new Event(),
            onCompleteEditing: new Event(),
            onCompleteDeleting: new Event(),
            showCategoryEditorWithAddMode: showCategoryEditorWithAddMode,
            showCategoryEditorWithEditMode: showCategoryEditorWithEditMode
        };

        return exports;
    });
