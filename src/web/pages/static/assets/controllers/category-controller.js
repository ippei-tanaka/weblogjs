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
                    categoryEditorMounter.props = {
                        mode: "del",
                        category: category,
                        onComplete: function () {
                            this.unmount();
                            exports.onCompleteDeleting.fire();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = categoryEditorMounter.build();
                    popupMounter.mount();
                }
            }
        );

        var showCategoryEditorWithAddMode = function () {
            categoryEditorMounter.props = {
                mode: "add",
                category: {},
                onComplete: function () {
                    this.unmount();
                    exports.onCompleteAdding.fire();
                }.bind(categoryEditorMounter)
            };
            categoryEditorMounter.mount();
        };

        var showCategoryEditorWithEditMode = function (id) {
            CategoryList.getCategory(id).then(function (category) {
                categoryEditorMounter.props = {
                    mode: "edit",
                    category: category,
                    onComplete: function () {
                        this.unmount();
                        exports.onCompleteEditing.fire();
                    }.bind(categoryEditorMounter)
                };
                categoryEditorMounter.mount();
            });
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
