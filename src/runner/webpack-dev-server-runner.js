import webpack from "webpack";
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigBuild from './webpack-config-build';
import { getEnv } from '../env-variables';

export const run = () => new Promise((resolve, reject) =>
{
    const ENV = getEnv();

    const config = webpackConfigBuild({
        webpackServerHost: ENV.webpack_server_port,
        webpackServerPort: ENV.webpack_server_host,
        sourceMap: true,
        envVariables: ENV
    });

    const compiler = webpack(config);

    const server = new WebpackDevServer(compiler, {
        inline: true,
        hot: true,
        publicPath: config.output.publicPath,
        stats: {colors: true}
    });

    server.listen(ENV.webpack_server_port, ENV.webpack_server_host);

    resolve();
});