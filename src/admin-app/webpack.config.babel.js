import path from 'path';
import webpack from 'webpack';

const production = process.env.NODE_ENV === "production";

let plugins = [
    new webpack.optimize.CommonsChunkPlugin("vendor.js")
];

if (production)
{
    plugins = plugins.concat([
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
        path: path.resolve(__dirname, './static/bundle'),
        filename: "[name].js"
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