import WeblogJS from '../src/index';
import co from 'co';

console.log("Starting Development Servers...");

const config = {
    webPort: 3001,
    webpackDevServer: true
};

WeblogJS.setConfig(config);

co(function* () {
    yield WeblogJS.startWebServer();

    const conf = WeblogJS.getConfig();
    console.log("");
    console.log("Web Server started...");
    console.log(`Go to ${conf.webProtocol}://${conf.webHost}:${conf.webPort}`);

    yield WeblogJS.startBrowserEntryFileServer();

}).catch(e => {
    console.error(e);
});