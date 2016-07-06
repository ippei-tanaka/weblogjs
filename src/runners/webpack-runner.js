import webpack from "webpack";
import webpackConfigBuilder from './webpack-config-builder';

const build = ({envVariables}) => new Promise((resolve, reject) =>
{
    const webpackConfig = webpackConfigBuilder.build({
        production: true,
        envVariables
    });

    webpack(webpackConfig, (error, stats) =>
    {
        if (!error)
        {
            console.log(stats.toString({colors: true}));
            resolve();
        }
        else
        {
            reject(error);
        }
    });
});

export default Object.freeze({build});