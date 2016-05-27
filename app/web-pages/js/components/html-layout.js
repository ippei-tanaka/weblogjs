import React from "react";

const DEVELOPMENT_MODE = process.env.WEBLOG_ENV === 'development';
const WP_DEV_SERVER_HOST = process.env.WEBLOG_WEBPACK_DEV_SERVER_HOST;
const WP_DEV_SERVER_PORT = process.env.WEBLOG_WEBPACK_DEV_SERVER_PORT;

export default function HtmlLayout() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="/vendors/font-awesome/css/font-awesome.min.css" media="all" rel="stylesheet"/>
            <link href="/style.css" media="all" rel="stylesheet"/>
            <title>Weblog JS</title>
        </head>
        <body>
        <div id="App" className="module-app">
            [CONTENT_PLACE_HOLDER]
        </div>
        { DEVELOPMENT_MODE ? (
            <script src={`//${WP_DEV_SERVER_HOST}:${WP_DEV_SERVER_PORT}/admin.js`}></script>
        ) : (
            <script src="/admin.js"></script>
        ) }
        </body>
        </html>
    )
};