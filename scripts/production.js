import WeblogJS from '../src/index';
import co from 'co';

console.log("Building client entry files...");

const config = {
    webPort: 3000
};

WeblogJS.setConfig(config);

co(function* () {
    yield WeblogJS.buildBrowserEntryFiles();

    yield WeblogJS.startWebServer();

    const conf = WeblogJS.getConfig();
    console.log("");
    console.log("Web Server started...");
    console.log(`Go to ${conf.webProtocol}://${conf.webHost}:${conf.webPort}`);
}).catch(e => {
    console.error(e);
});