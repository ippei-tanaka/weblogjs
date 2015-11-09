requirejs.config({
    baseUrl: "/assets/js/",

    jsx: {
        fileExtension: '.jsx'
    },

    paths: {
        "jquery": "../../vendors/jquery.min",
        "es6-promise": "../../vendors/es6-promise.min",
        "jsx": "../../vendors/jsx",
        "text": "../../vendors/text",
        "JSXTransformer": "../../vendors/JSXTransformer",
        "react": "../../vendors/react-with-addons.min",
        "react-dom": "../../vendors/react-dom.min",
        "event-manager": "../modules/event-manager"
    }
});
