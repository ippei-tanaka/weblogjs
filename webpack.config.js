require('./app/babel-request');

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WEBLOG_ENV = require('./env-variables');

const DEVELOPMENT_MODE = WEBLOG_ENV === 'webpack-dev-server';
const STATIC_DIR = path.resolve(__dirname, "./app/web-pages/static");
const ADMIN_ENTRY_FILE = path.resolve(__dirname, "./app/web-pages/admin-browser.js");
const PUBLIC_ENTRY_FILE = path.resolve(__dirname, "./app/web-pages/public-browser.js");

const regPlugins = [
    new webpack.DefinePlugin({
        "process.env": {
            WEBLOG_ENV: WEBLOG_ENV
        }
    })
];

const prodPlugins = [
    new ExtractTextPlugin('style.css', {
        allChunks: true
    }),
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true})
];

module.exports = {

    entry: {
        admin: [
            "babel-polyfill",
            ADMIN_ENTRY_FILE
        ],
        public: [
            "babel-polyfill",
            PUBLIC_ENTRY_FILE
        ]
    },

    output: {
        path: STATIC_DIR,
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

    plugins: DEVELOPMENT_MODE ? regPlugins : regPlugins.concat(prodPlugins)
};