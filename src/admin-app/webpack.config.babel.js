import path from 'path';
import webpack from 'webpack';
//import ExtractTextPlugin from 'extract-text-webpack-plugin';

const production = process.env.NODE_ENV === "production";

let plugins = [
    /*
    new webpack.DefinePlugin({
        "process.env": {
            "ADMIN_": JSON.stringify(envVariables)
        }
    }),
    */
    new webpack.optimize.CommonsChunkPlugin("vendor.js")
];

if (production)
{
    plugins = plugins.concat([
        //new ExtractTextPlugin(cssFileName, {allChunks: true}),
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

export default {
    entry: {
        admin: [
            "babel-polyfill",
            path.resolve(__dirname, './browser-entry.js')
        ]
    },

    output: {
        path: path.resolve(__dirname, './bundle'),
        filename: "[name].js",
        //publicPath: `http://${webpackDevServerHost}:${webpackDevServerPort}/bundle`
    },

    devtool: production ? null : 'source-map',

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
            /*,
            {
                test: /\.scss$/,
                loader: production ? ExtractTextPlugin.extract("style", "css!sass") : null,
                loaders: production ? null : ["style", "css", "sass"]
            },
            {
                test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
                loader: 'url-loader'
            }*/
        ]
    },

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    resolveLoader: {
        root: path.resolve(__dirname, '../../node_module')
    },

    plugins: plugins

}