import React from "react";

export default class Html extends React.Component {

    render() {
        return (
            <html lang="en">
            <head>
                <meta charSet="utf-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title></title>
            </head>
            <body>
            <div id="App" className="module-app">
                [CONTENT_PLACE_HOLDER]
            </div>
            <script src="http://localhost:8080/index.js"></script>
            </body>
            </html>
        )
    }

};