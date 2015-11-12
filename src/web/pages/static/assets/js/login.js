"use strict";

requirejs([
        'jsx!components/login-form'
    ],
    function (
        LoginForm
    ) {
        LoginForm.render(document.querySelector("[data-react='login-form']"));
    });