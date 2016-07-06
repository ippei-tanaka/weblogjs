import webpack from "webpack";
import webpackConfigBuild from './webpack-config-build';
import { getEnv } from '../env-variables';

export const run = () => new Promise((resolve, reject) =>
{
    const ENV = getEnv();

    const config = webpackConfigBuild({
        envVariables: ENV,
        production: true
    });

    webpack(config, (err, stats) =>
    {
        if (!err)
        {
            console.log(stats.toString({colors: true}));
            resolve();
        }
        else
        {
            reject(err);
        }
    });
});