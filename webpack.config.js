"use strict";

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const WEB_STATIC_DIR = path.resolve(__dirname, "./src/web/pages/static");

// Configured in package.json
const PRODUCTION_MODE = process.env.NODE_ENV === 'production';

module.exports = {
    /*entry: {
        index: path.resolve(__dirname, "./src/web/pages/components/router/browser.js")
    },
    */
    entry: [
        "babel-polyfill",
        path.resolve(__dirname, "./src/web/pages/components/router/browser.js")
    ],

    output: {
        path: WEB_STATIC_DIR + "/admin/",
        filename: "index.js"
    },

    devtool: PRODUCTION_MODE ? null : 'source-map',

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
                loader: PRODUCTION_MODE ? ExtractTextPlugin.extract("style", "css!sass") : null,
                loaders: PRODUCTION_MODE ? null : ["style", "css", "sass"]
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    plugins: PRODUCTION_MODE ? [
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : null
};