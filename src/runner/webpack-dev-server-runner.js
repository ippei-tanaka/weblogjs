import webpack from "webpack";
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from './webpack.config';
import { getEnv } from '../env-variables';

export const run = () => new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, {
        inline: true,
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
    });
    const ENV = getEnv();
    server.listen(ENV.webpack_server_port, ENV.webpack_server_host);
    resolve();
});