import React from "react";
import WEBLOG_ENV from '../../../../env-variables';

const DEVELOPMENT_MODE = process.env.WEBLOG_ENV === 'development';
const PRODUCTION_MODE = process.env.WEBLOG_ENV === 'production';
const WP_DEV_SERVER_HOST = process.env.WB_WEBPACK_SERVER_HOST;
const WP_DEV_SERVER_PORT = process.env.WB_WEBPACK_SERVER_PORT;

export default function PublicHtmlLayout() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="/vendors/font-awesome/css/font-awesome.min.css" media="all" rel="stylesheet"/>
            <link href="/style.css" media="all" rel="stylesheet"/>
            <title>[TITLE_PLACE_HOLDER]</title>
        </head>
        <body>
        <div id="App">
            [CONTENT_PLACE_HOLDER]
        </div>
        { DEVELOPMENT_MODE ? <script src={`//${WP_DEV_SERVER_HOST}:${WP_DEV_SERVER_PORT}/public.js`}></script> : null }
        { PRODUCTION_MODE ? <script src="/public.js"></script> : null }
        </body>
        </html>
    )
};