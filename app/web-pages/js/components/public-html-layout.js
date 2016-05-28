import React from "react";

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
        <div className="module-app">
            [CONTENT_PLACE_HOLDER]
        </div>
        </body>
        </html>
    )
};