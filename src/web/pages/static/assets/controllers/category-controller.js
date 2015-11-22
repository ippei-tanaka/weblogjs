"use strict";

define([
        'jsx!components/category-list',
        'jsx!components/category-editor',
        'jsx!components/popup',
        'services/react-component-mounter',
        'services/event'
    ],
    function (CategoryList,
              CategoryEditor,
              PopUp,
              Mounter,
              Event) {


        var categoryEditorMounter = new Mounter(
            CategoryEditor,  'main-content-container');

        var popupMounter = new Mounter(PopUp, 'popup-container');

        popupMounter.props = {
            onClosed: function () {
                this.unmount();
            }.bind(popupMounter)
        };

        var categoryListMounter = new Mounter(
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

        var showCategoryEditorWithAddMode = function () {
            categoryEditorMounter.props = {
                mode: "add",
                categoryId: null,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(categoryEditorMounter)
            };
            categoryEditorMounter.mount();
        };

        var showCategoryEditorWithEditMode = function (id) {
            categoryEditorMounter.props = {
                mode: "edit",
                categoryId: id,
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteEditing.fire();
                }.bind(categoryEditorMounter)
            };
            categoryEditorMounter.mount();
        };

        var showCategoryEditorWithDeleteMode = function (id) {
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

        var exports = {
            showCategoryList: function () {
                popupMounter.unmount();
                categoryListMounter.mount();
            },
            onClickAddButton: new Event(),
            onClickEditButton: new Event(),
            onCompleteAdding: new Event(),
            onCompleteEditing: new Event(),
            onCompleteDeleting: new Event(),
            showCategoryEditorWithAddMode: showCategoryEditorWithAddMode,
            showCategoryEditorWithEditMode: showCategoryEditorWithEditMode
        };

        return exports;
    });
