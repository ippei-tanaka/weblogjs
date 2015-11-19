"use strict";

define([
        'jsx!components/category-list',
        'jsx!components/category-editor',
        'jsx!components/popup',
        'services/react-component-mounter'
    ],
    function (CategoryList,
              CategoryEditor,
              PopUp,
              Mounter) {


        var categoryEditorMounter = new Mounter(CategoryEditor);


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
                    categoryEditorMounter.props = {
                        mode: "add",
                        category: {},
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = categoryEditorMounter.build();
                    popupMounter.mount();
                },

                editButtonClicked: function (category) {
                    categoryEditorMounter.props = {
                        mode: "edit",
                        category: category,
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = categoryEditorMounter.build();
                    popupMounter.mount();
                },

                deleteButtonClicked: function (category) {
                    categoryEditorMounter.props = {
                        mode: "del",
                        category: category,
                        onComplete: function () {
                            this.unmount();
                        }.bind(popupMounter)
                    };
                    popupMounter.children = categoryEditorMounter.build();
                    popupMounter.mount();
                }
            }
        );


        return {
            showCategoryList: function () {
                popupMounter.unmount();
                categoryListMounter.mount();
            }
        };
    });
