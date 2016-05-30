import React from "react";
import WEBLOG_ENV from '../../../../env-variables';

const DEVELOPMENT_MODE = WEBLOG_ENV.mode === 'development';
const PRODUCTION_MODE = WEBLOG_ENV.mode === 'production';
const WP_DEV_SERVER_HOST = WEBLOG_ENV.webpack_server_host;
const WP_DEV_SERVER_PORT = WEBLOG_ENV.webpack_server_port;

export default function AdminHtmlLayout() {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="/vendors/font-awesome/css/font-awesome.min.css" media="all" rel="stylesheet"/>
            { PRODUCTION_MODE ? <link href="/bundle/admin-style.css" media="all" rel="stylesheet"/> : null }
            <title>[TITLE_PLACE_HOLDER]</title>
            { DEVELOPMENT_MODE ? <script src={`//${WP_DEV_SERVER_HOST}:${WP_DEV_SERVER_PORT}/bundle/vendor.js`}></script> : null }
            { DEVELOPMENT_MODE ? <script src={`//${WP_DEV_SERVER_HOST}:${WP_DEV_SERVER_PORT}/bundle/admin.js`}></script> : null }
            { PRODUCTION_MODE ? <script src="/bundle/vendor.js"></script> : null }
            { PRODUCTION_MODE ? <script src="/bundle/admin.js"></script> : null }
        </head>
        <body>
            <div id="AppContainer" className="module-admin">[CONTENT_PLACE_HOLDER]</div>
        </body>
        </html>
    )
};