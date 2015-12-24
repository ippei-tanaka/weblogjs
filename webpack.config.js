"use strict";

var path = require('path');

//const WEB_STATIC_SRC_DIR = path.resolve(__dirname, "./src/web/pages/static-src");
const WEB_STATIC_DIR = path.resolve(__dirname, "./src/web/pages/static");

module.exports = {
    entry: {
        index: path.resolve(__dirname, "./src/web/pages/components/router/browser.js")
    },
    output: {
        path: WEB_STATIC_DIR + "/admin/assets",
        filename: "index.js"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};