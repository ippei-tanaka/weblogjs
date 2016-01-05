"use strict";

var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const WEB_STATIC_DIR = path.resolve(__dirname, "./src/web/pages/static");

// Configured in package.json
const DEVELOPMENT_MODE = process.env.NODE_ENV === 'webpack-development';

module.exports = {
    entry: {
        index: path.resolve(__dirname, "./src/web/pages/components/router/browser.js"),
    },
    output: {
        path: WEB_STATIC_DIR + "/admin/assets",
        filename: "[name].js"
    },
    devtool: DEVELOPMENT_MODE ? 'source-map' : null,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loader: DEVELOPMENT_MODE ? null : ExtractTextPlugin.extract("style", "css!sass"),
                loaders: DEVELOPMENT_MODE ? ["style", "css", "sass"] : null
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: DEVELOPMENT_MODE ? null : [
        new ExtractTextPlugin('public/style.css', {
            allChunks: true
        })
    ]
};