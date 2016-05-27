var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEVELOPMENT_MODE = process.env.WEBLOG_ENV === 'webpack-dev-server';
const STATIC_DIR = path.resolve(__dirname, "./app/web-pages/static");
const ENTRY_FILE = path.resolve(__dirname, "./app/web-pages/js/routers/browser.js");

const regPlugins = [
    new webpack.DefinePlugin({
        "process.env": {
            WB_WSERVER_PORT: process.env.WB_WSERVER_PORT
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

    entry: [
        "babel-polyfill",
        ENTRY_FILE
    ],

    output: {
        path: STATIC_DIR,
        filename: "admin.js"
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