"use strict";

requirejs([
        'react',
        'react-dom',
        'jsx!components/login-form'
    ],
    function (
        React,
        ReactDom,
        LoginForm
    ) {
        ReactDom.render(
            React.createElement(LoginForm),
            document.querySelector("[data-react='login-form']")
        );
    });