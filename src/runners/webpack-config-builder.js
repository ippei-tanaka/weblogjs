import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const build = ({
    webpackDevServerHost,
    webpackDevServerPort,
    envVariables = {},
    envNamespace,
    production = false,
    sourceMap = false,
    staticPath,
    bundleDirName,
    adminEntryFile,
    publicEntryFile,
    nodeModuleDir,
    vendorJsFileName,
    cssFileName,
    jsFileName,
    adminFileNameBase,
    publicFileNameBase
    }) =>
{

    const outputDir = path.resolve(staticPath, bundleDirName);

    let plugins = [
        new webpack.DefinePlugin({
            "process.env": {
                [envNamespace]: JSON.stringify(envVariables)
            }
        }),
        new webpack.optimize.CommonsChunkPlugin(vendorJsFileName)
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
            [adminFileNameBase]: [
                "babel-polyfill",
                adminEntryFile
            ],
            [publicFileNameBase]: [
                "babel-polyfill",
                publicEntryFile
            ]
        },

        output: {
            path: outputDir,
            filename: jsFileName,
            publicPath: `http://${webpackDevServerHost}:${webpackDevServerPort}/${bundleDirName}`
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