import WeblogJS from '../src/index';
import co from 'co';

const config = {
    webPort: 3001,
    webpackDevServer: true,
    webpackDevServerPort: 3002
};

WeblogJS.setConfig(config);

co(function* () {
    yield WeblogJS.startWebServer();
    yield WeblogJS.startBrowserEntryFileServer();
}).catch(error => {
    console.error(error);
    process.exit(error);
});