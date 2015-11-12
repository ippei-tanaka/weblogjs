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
        "react": "../vendors/react-with-addons.min",
        "react-dom": "../vendors/react-dom.min",
        "global-events": "modules/global-events",
        "event": "modules/event",
        "moment": "../vendors/moment"
    }
});
