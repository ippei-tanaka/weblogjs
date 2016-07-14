import WeblogJS from '../src/index';
import co from 'co';
import path from 'path';

const config = {
    webPort: 3001,
    webpackDevServer: true,
    webpackDevServerPort: 3002,
    staticPath: path.resolve(__dirname, "../temp")
};

WeblogJS.setConfig(config);

co(function* () {
    yield WeblogJS.startWebServer();
    yield WeblogJS.startBrowserEntryFileServer();
}).catch(error => {
    console.error(error);
    process.exit(error);
});