import React from 'react';
import PublicCategoryList from '../../react-components/public-category-list';
import config from "../../config";
import path from 'path';

const root = config.getValue('publicSiteRoot');

export default ({children, blogName, categories, title, theme}) => (
    <html lang="en">
    <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link href={path.resolve(root, `bundle/themes/${theme || 'default'}.css`)} media="screen" rel="stylesheet"/>
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
                <aside className="m-bll-sidebar">
                    <section className="module-section">
                        <PublicCategoryList categories={categories} rootDir={root} />
                    </section>
                </aside>
            </div>
        </div>
        <footer className="m-hfl-footer">
            <span>&copy;{blogName}</span>
        </footer>
    </div>
    </body>
    </html>
);