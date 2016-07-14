import React from "react";

function safeStringify (obj)
{
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

const build = ({webpackDevServer, webpackDevServerHost, webpackDevServerPort}) =>
{
    return ({title, preloadedState, children}) => (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            { !webpackDevServer && <link href="/bundle/admin-style.css" media="all" rel="stylesheet"/> }
            <title>{title}</title>
            { preloadedState && <script dangerouslySetInnerHTML={{__html:`window.__PRELOADED_STATE__ = ${safeStringify(preloadedState)}`}}></script> }
            { webpackDevServer && <script src={`//${webpackDevServerHost}:${webpackDevServerPort}/bundle/vendor.js`}></script> }
            { webpackDevServer && <script src={`//${webpackDevServerHost}:${webpackDevServerPort}/bundle/admin.js`}></script> }
            { !webpackDevServer && <script src="/bundle/vendor.js"></script> }
            { !webpackDevServer && <script src="/bundle/admin.js"></script> }
        </head>
        <body>
        <div id="AppContainer" className="module-app">{children}</div>
        </body>
        </html>
    );
};

export default Object.freeze({build});