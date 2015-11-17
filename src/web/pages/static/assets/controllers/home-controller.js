"use strict";

define([
        'controllers/user-controller'
    ],
    function (UserController) {

        return {
            showDashBoard: function () {
                UserController.clean();
            }
        }
    });
