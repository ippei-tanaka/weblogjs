import webpack from "webpack";
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack-config-builder';

const start = ({
    webpackServerHost,
    webpackServerPort,
    webpageRootForAdmin,
    adminApiRoot}) => new Promise((resolve, reject) =>
{
    const webpackConfig = webpackConfigBuilder.build({
        webpackDevServer: true,
        webpackServerHost,
        webpackServerPort,
        sourceMap: true,
        envVariables: {
            webpageRootForAdmin,
            adminApiRoot
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
        webpackServerPort,
        webpackServerHost,
        () =>
        {
            resolve();
        });

});

export default Object.freeze({start});