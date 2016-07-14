import webpack from "webpack";
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack-config-builder';
import path from 'path';

const start = ({
    staticPath,
    webpackDevServerHost,
    webpackDevServerPort,
    adminDir,
    adminApiRoot,
    publicDir,
    publicApiRoot,
    webpageRoot,
    webProtocol,
    webHost,
    webPort
    }) => new Promise((resolve, reject) =>
{
    const webpageRootForAdmin = path.resolve(webpageRoot, adminDir);
    const webpageRootForPublic = path.resolve(webpageRoot, publicDir);
    const webpackConfig = webpackConfigBuilder.build({
        staticPath,
        webpackDevServerHost,
        webpackDevServerPort,
        sourceMap: true,
        envVariables: {
            webpageRootForAdmin,
            adminApiRoot,
            webpageRootForPublic,
            publicApiRoot,
            webProtocol,
            webHost,
            webPort,
            adminDir,
            publicDir
        }
    });

    const compiler = webpack(webpackConfig);

    const server = new WebpackDevServer(compiler, {
        inline: true,
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
    });

    server.listen(
        webpackDevServerPort,
        webpackDevServerHost,
        () =>
        {
            resolve();
        });

});

export default Object.freeze({start});