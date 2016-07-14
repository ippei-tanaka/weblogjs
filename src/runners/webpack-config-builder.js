import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const build = ({
    webpackServerHost = "localhost",
    webpackServerPort = 8080,
    envVariables = {},
    envNamespace = 'WEBLOG_WEBPACK_ENV',
    production = false,
    sourceMap = false,
    staticPath = null,
    bundleDirName = "bundle",
    adminEntryFile = path.resolve(__dirname, "../admin-app/browser-entry.js"),
    publicEntryFile = path.resolve(__dirname, "../public-app/browser-entry.js"),
    nodeModuleDir = path.resolve(__dirname, "../../node_modules"),
    vendorFileName = "vendor.js",
    cssFileName = "[name]-style.css"
    }) =>
{

    const outputDir = path.resolve(staticPath, bundleDirName);

    let plugins = [
        new webpack.DefinePlugin({
            "process.env": {
                [envNamespace]: JSON.stringify(envVariables)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin(vendorFileName)
    ];

    if (production)
    {
        plugins = plugins.concat([
            new ExtractTextPlugin(cssFileName, {allChunks: true}),
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
        ]);
    }

    return {
        entry: {
            admin: [
                "babel-polyfill",
                adminEntryFile
            ],
            public: [
                "babel-polyfill",
                publicEntryFile
            ]
        },

        output: {
            path: outputDir,
            filename: "[name].js",
            publicPath: `http://${webpackServerHost}:${webpackServerPort}/${bundleDirName}`
        },

        devtool: sourceMap ? 'source-map' : null,

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
                    loader: production ? ExtractTextPlugin.extract("style", "css!sass") : null,
                    loaders: production ? null : ["style", "css", "sass"]
                },
                {
                    test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                    loader: 'url-loader'
                }
            ]
        },

        resolve: {
            extensions: ['', '.js', '.jsx']
        },

        resolveLoader: {
            root: nodeModuleDir
        },

        plugins: plugins

    };
};

export default Object.freeze({build});