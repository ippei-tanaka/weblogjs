import webpack from "webpack";
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuilder from './webpack-config-builder';

const start = ({webpackServerHost, webpackServerPort, envVariables}) => new Promise((resolve, reject) =>
{
    const webpackConfig = webpackConfigBuilder.build({
        webpackServerHost,
        webpackServerPort,
        sourceMap: true,
        envVariables
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