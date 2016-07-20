import React from "react";

function safeStringify (obj)
{
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

const build = ({
    webpackDevServer,
    webpackDevServerHost,
    webpackDevServerPort,
    bundleDirName,
    vendorJsFileName,
    jsFileName,
    cssFileName}) =>
{
    return ({title, preloadedState, children}) => (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <title>{title}</title>
            { !webpackDevServer && <link href={`/${bundleDirName}/${cssFileName}`} media="media" rel="stylesheet"/> }
            { preloadedState && <script dangerouslySetInnerHTML={{__html:`window.__PRELOADED_STATE__ = ${safeStringify(preloadedState)}`}}></script> }
            { webpackDevServer && <script src={`//${webpackDevServerHost}:${webpackDevServerPort}/${bundleDirName}/${vendorJsFileName}`}></script> }
            { webpackDevServer && <script src={`//${webpackDevServerHost}:${webpackDevServerPort}/${bundleDirName}/${jsFileName}`}></script> }
            { !webpackDevServer && <script src={`/${bundleDirName}/${vendorJsFileName}`}></script> }
            { !webpackDevServer && <script src={`/${bundleDirName}/${jsFileName}`}></script> }
        </head>
        <body>
        <div id="AppContainer" className="module-app">{children}</div>
        </body>
        </html>
    );
};

export default Object.freeze({build});