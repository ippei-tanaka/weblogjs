import webpack from "webpack";
import webpackConfig from './webpack.config';

export const run = () => new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
        if (!err) {
            console.log (stats.toString({colors: true}));
            resolve();
        } else {
            reject(err);
        }
    });
});