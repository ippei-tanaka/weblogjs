"use strict";

define([
        'services/react-component-mounter'
    ],
    function (Mounter) {

        return {

            showDashBoard: function () {
                Mounter.unmountComponentsAt(
                    Mounter.select('main-content-container')
                );

                Mounter.unmountComponentsAt(
                    Mounter.select('popup-container')
                );
            }
        }
    });
