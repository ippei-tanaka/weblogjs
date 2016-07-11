import webpack from "webpack";
import webpackConfigBuilder from './webpack-config-builder';

const build = ({
    staticPath,
    webpageRootForAdmin,
    adminApiRoot,
    webpageRootForPublic,
    publicApiRoot,
    webProtocol,
    webHost,
    webPort
    }) => new Promise((resolve, reject) =>
{
    const webpackConfig = webpackConfigBuilder.build({
        production: true,
        staticPath,
        envVariables: {
            webpageRootForAdmin,
            adminApiRoot,
            webpageRootForPublic,
            publicApiRoot,
            webProtocol,
            webHost,
            webPort
        }
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