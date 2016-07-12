import WeblogJS from '../src/index';
import co from 'co';

console.log("Starting Development Servers...");

const config = {
    //publicDir: "ddd",
    webPort: 3001,
    webpackDevServer: true,
    webpackDevServerPort: 3002
};

WeblogJS.setConfig(config);

co(function* () {
    yield WeblogJS.startWebServer();

    const c = WeblogJS.getConfig();
    console.log("");
    console.log("Web Server started...");
    console.log(`Go to the public page: ${c.webProtocol}://${c.webHost}:${c.webPort}/${c.publicDir}`);
    console.log(`Or, go to the admin page: ${c.webProtocol}://${c.webHost}:${c.webPort}/${c.adminDir}`);

    yield WeblogJS.startBrowserEntryFileServer();

}).catch(e => {
    console.error(e);
});