"use strict";

define([
        'services/react-component-mounter',
        'jsx!components/dashboard'
    ],
    function (Mounter, Dashboard) {

        return {

            showDashBoard: function () {
                var dashboardMounter = new Mounter(Dashboard, 'main-content-container');

                dashboardMounter.mount();

                Mounter.unmountComponentsAt(
                    Mounter.select('popup-container')
                );
            }
        }
    });
