import React from "react";
import Immutable from 'immutable';
//import { getEnv } from '../env-variables';

// TODO Make those variable parameters
const WEBLOG_ENV = {};//getEnv();
const DEVELOPMENT_MODE = WEBLOG_ENV.mode === 'development';
const PRODUCTION_MODE = WEBLOG_ENV.mode === 'production';
const WP_DEV_SERVER_HOST = WEBLOG_ENV.webpack_server_host;
const WP_DEV_SERVER_PORT = WEBLOG_ENV.webpack_server_port;

function safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

export default function PublicHtmlLayout({title, children, preloadedState}) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link href="/vendors/font-awesome/css/font-awesome.min.css" media="all" rel="stylesheet"/>
            <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
            { PRODUCTION_MODE ? <link href="/bundle/public-style.css" media="all" rel="stylesheet"/> : null }
            <title>{title}</title>
            { preloadedState ? <script dangerouslySetInnerHTML={{__html:`window.__PRELOADED_STATE__ = ${safeStringify(preloadedState)}`}}></script> : null }
            { DEVELOPMENT_MODE ? <script src={`//${WP_DEV_SERVER_HOST}:${WP_DEV_SERVER_PORT}/bundle/vendor.js`}></script> : null }
            { DEVELOPMENT_MODE ? <script src={`//${WP_DEV_SERVER_HOST}:${WP_DEV_SERVER_PORT}/bundle/public.js`}></script> : null }
            {/*
            { PRODUCTION_MODE ? <script src="/bundle/vendor.js"></script> : null }
            { PRODUCTION_MODE ? <script src="/bundle/public.js"></script> : null }
            */}
        </head>
        <body>
            <div id="AppContainer">{children}</div>
        </body>
        </html>
    )
};