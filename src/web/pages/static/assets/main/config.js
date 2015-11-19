"use strict";

requirejs.config({
    baseUrl: "/assets/",

    jsx: {
        fileExtension: '.jsx'
    },

    paths: {
        "jquery": "../vendors/jquery.min",
        "es6-promise": "../vendors/es6-promise.min",
        "jsx": "../vendors/jsx",
        "text": "../vendors/text",
        "JSXTransformer": "../vendors/JSXTransformer",
        "react": "../vendors/react-with-addons",
        "react-dom": "../vendors/react-dom.min",
        "classnames": "../vendors/classnames",
        "moment": "../vendors/moment"
    }
});
