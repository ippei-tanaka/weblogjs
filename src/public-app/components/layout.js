import React from 'react';
import config from "../../config";
import urlResolver from "../../utilities/url-resolver";

const root = urlResolver.resolve(config.getValue('publicSiteRoot')) + "/";

export default ({children, blogName = "", title = "", theme, menu}) => (
    <html lang="en">
    <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link href={`${root}bundle/themes/${theme}.css`} media="screen" rel="stylesheet"/>
        <title>{title}</title>
    </head>
    <body>
    <div className="module-header-footer-layout">
        <header className="m-hfl-header">
            <h1><a className="m-hfl-header-link" href={root}>{blogName}</a></h1>
        </header>
        <div className="m-hfl-body">
            <div className="module-blog-layout">
                <div className="m-bll-main">
                    {children}
                </div>
                {menu && (
                    <aside className="m-bll-menu">
                        {menu}
                    </aside>
                )}
            </div>
        </div>
        <footer className="m-hfl-footer">
            <span>&copy;{blogName}</span>
        </footer>
    </div>
    </body>
    </html>
);