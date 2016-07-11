import WeblogJS from '../src/index';

const config = {
    webPort: 3001,
    webpackDevServer: true
};

WeblogJS.setConfig(config);

WeblogJS.startWebServer().then(() => {
    console.log("Web Server started...");
    WeblogJS.startBrowserEntryFileServer();
}).catch(e => {
    console.error(e);
});