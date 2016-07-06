import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { getEnv } from '../env-variables';

// TODO Make those strings parameters given by outside
const ENV = getEnv();
const WEBPACK_DEV_MODE = ENV.mode === 'webpack-dev-server';
const WEBPACK_SERVER_PORT = ENV.webpack_server_port;
const WEBPACK_SERVER_HOST = ENV.webpack_server_host;
const BUNDLE_DIR = "bundle";
const OUTPUT_DIR = path.resolve(__dirname, `../client/static/${BUNDLE_DIR}`);
const ADMIN_ENTRY_FILE = path.resolve(__dirname, "../admin-app/browser-entry.js");
const PUBLIC_ENTRY_FILE = path.resolve(__dirname, "../public-app/browser-entry.js");
const NODE_MODULE_DIR = path.resolve(__dirname, "../../node_modules");

const regPlugins = [
    new webpack.DefinePlugin({
        "process.env": {
            WEBLOG_WEBPACK_ENV: JSON.stringify(ENV)
        }
    }),
    new webpack.optimize.CommonsChunkPlugin("vendor.js")
];

const prodPlugins = [
    new ExtractTextPlugin('[name]-style.css', {allChunks: true}),
    new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
            warnings: false
        }
    })
];

export default {

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
        path: OUTPUT_DIR,
        filename: "[name].js",
        publicPath: `http://${WEBPACK_SERVER_HOST}:${WEBPACK_SERVER_PORT}/${BUNDLE_DIR}`
    },

    devtool: WEBPACK_DEV_MODE ? 'source-map' : null,

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
                loader: WEBPACK_DEV_MODE ? null : ExtractTextPlugin.extract("style", "css!sass"),
                loaders: WEBPACK_DEV_MODE ? ["style", "css", "sass"] : null
            }
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    resolveLoader: {
        root: NODE_MODULE_DIR
    },

    plugins: WEBPACK_DEV_MODE ? regPlugins : regPlugins.concat(prodPlugins)

};