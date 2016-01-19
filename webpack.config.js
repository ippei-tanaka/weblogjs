var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


const PRODUCTION_MODE = process.env.NODE_ENV === 'production'; // Configured in package.json
const STATIC_DIR = path.resolve(__dirname, "./app/web-pages/static");
const ENTRY_FILE = path.resolve(__dirname, "./app/web-pages/components/router/browser.js");


module.exports = {

    entry: [
        "babel-polyfill",
        ENTRY_FILE
    ],

    output: {
        path: STATIC_DIR + "/admin/",
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