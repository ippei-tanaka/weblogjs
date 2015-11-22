"use strict";

define([
        'services/react-component-mounter',
        'jsx!components/dashboard'
    ],
    function (Mounter, Dashboard) {

        return {

            showDashBoard: function () {
                new Mounter(Dashboard, 'main-content-container').mount();

                Mounter.unmountComponentsAt(
                    Mounter.select('popup-container')
                );

                Mounter.unmountComponentsAt(
                    Mounter.select('location-bar-container')
                );
            }
        }
    });
