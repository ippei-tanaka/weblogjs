import React from "react";
import config from "../config";
import path from 'path';

const root = config.getValue('adminSiteRoot');

export default ({children}) => (
    <html lang="en">
    <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link href={path.resolve(root, 'main.css')} media="screen" rel="stylesheet"/>
        <script src={path.resolve(root, 'vendor.js')}></script>
        <script src={path.resolve(root, 'admin.js')}></script>
        <title>Weblog JS Admin</title>
    </head>
    <body>
    <div id="AppContainer" className="module-app">{children}</div>
    </body>
    </html>
);