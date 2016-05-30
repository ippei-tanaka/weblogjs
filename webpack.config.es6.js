import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WEBLOG_ENV from './env-variables';

const WEBPACK_DEV_MODE = WEBLOG_ENV.mode === 'webpack-dev-server';
const WEBPACK_SERVER_PORT = WEBLOG_ENV.webpack_server_port;
const STATIC_DIR = path.resolve(__dirname, "./app/web-pages/static");
const ADMIN_ENTRY_FILE = path.resolve(__dirname, "./app/web-pages/admin-browser.js");
const PUBLIC_ENTRY_FILE = path.resolve(__dirname, "./app/web-pages/public-browser.js");

const regPlugins = [
    new webpack.DefinePlugin({
        "process.env": {
            WEBLOG_WEBPACK_ENV: JSON.stringify(WEBLOG_ENV)
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
        path: path.resolve(STATIC_DIR, 'bundle'),
        filename: "[name].js",
        publicPath: `http://localhost:${WEBPACK_SERVER_PORT}/bundle/`
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

    plugins: WEBPACK_DEV_MODE ? regPlugins : regPlugins.concat(prodPlugins)
};